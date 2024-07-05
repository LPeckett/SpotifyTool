using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Azure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SpotifyTool.Server.Data;
using SpotifyTool.Server.Models;

namespace SpotifyTool.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly SpotifyToolServerContext _context;
        private readonly IConfiguration _configuration;

        public UsersController(SpotifyToolServerContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // GET: api/Users
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<SafeUser>>> GetUser()
        {
            return await _context.User.ToListAsync();
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<SafeUser>> GetUser(int id)
        {
            var user = await _context.User.FindAsync(id);

            if (user == null)
            {
                return NotFound(new {error = "User not found"});
            }

            return GetSafeUser(user);
        }

        [HttpGet("token")]
        [Authorize]
        public async Task<ActionResult<SafeUser>> GetUserByToken()
        {
            string head = Request.Headers["Authorization"];
            string token = head.Split(" ")[1];

            var jsonToken = new JwtSecurityToken(token);
            string email = jsonToken.Claims.First(c => c.Type == ClaimTypes.Email).Value;

            User user = _context.User.Where(u => u.Email == email).FirstOrDefault();
            SafeUser su = GetSafeUser(user);

            return Ok(su);
        }

        // PUT: api/Users/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPatch("{id}")]
        [Authorize]
        public async Task<ActionResult<SafeUser>> PatchUser(int id, JsonPatchDocument<SafeUser> patch)
        {
            SafeUser fromDB = _context.User.FirstOrDefault(u => u.Id == id);
            patch.ApplyTo(fromDB, ModelState);

            bool isValid = TryValidateModel(fromDB);
            if (!isValid)
            {
                return BadRequest(new { error = "Invalid patch request" });
            }

            _context.Update(fromDB);
            await _context.SaveChangesAsync();

            SafeUser su = GetSafeUser((User)fromDB);

            return Ok(su);
        }

        // POST: api/Users
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<SafeUser>> Register(User user)
        {
            string password = user.Password;
            if (password == null)
            {
                return BadRequest(new { error = "Please provide a password" });
            }

            if (EmailExists(user.Email))
            {
                return BadRequest(new { error = "An account already exists with that email" });
            }

            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);
            user.Password = hashedPassword;

            _context.User.Add(user);
            await _context.SaveChangesAsync();

            SafeUser su = GetSafeUser(user);

            return CreatedAtAction("GetUser", new { id = su.Id }, su);
        }

        [HttpPost("login")]
        public async Task<ActionResult<User>> Login(Login user)
        {
            if (user.Email == null || user.Password == null)
            {
                return BadRequest(new { error = "Please provide a email and password" });
            }

            var userObj = _context.User.Where(u => u.Email == user.Email);
            if (userObj.Count() == 0 || userObj.Count() > 1)
            {
                return Unauthorized(new { error = "Invalid login credentials" });
            }

            string tHash = userObj.First().Password;
            if (tHash == null)
            {
                return Unauthorized(new { error = "Invalid login credentials" });
            }

            if (BCrypt.Net.BCrypt.Verify(user.Password, tHash))
            {
                JwtSecurityToken token = GenerateAccessToken(user.Email);
                string refreshToken = Guid.NewGuid().ToString();
                userObj.First().RefreshToken = refreshToken;
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    AccessToken = new JwtSecurityTokenHandler().WriteToken(token),
                    RefreshToken = refreshToken
                });
            }

            return Unauthorized(new { error = "Invalid login credentials" });
        }

        [HttpPost("refresh")]
        public async Task<ActionResult<SafeUser>> RefreshToken(RefreshRequest refreshRequest)
        {
            User user = GetUserByRefreshToken(refreshRequest.Token);
            if (user == null)
            {
                return Unauthorized(new { error = "Bad refresh token" });
            }

            JwtSecurityToken token = GenerateAccessToken(user.Email);
            string refreshToken = Guid.NewGuid().ToString();
            user.RefreshToken = refreshToken;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                AccessToken = new JwtSecurityTokenHandler().WriteToken(token),
                RefreshToken = refreshToken
            });
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.User.FindAsync(id);
            if (user == null)
            {
                return NotFound(new {error = "A user does not exist with the supplied ID"});
            }

            _context.User.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(int id)
        {
            return _context.User.Any(e => e.Id == id);
        }

        private bool EmailExists(string email)
        {
            return _context.User.Any(e => e.Email == email);
        }

        private User GetUserByRefreshToken(string token)
        {
            var users = _context.User.Where(e => e.RefreshToken == token);
            if (users.Count() == 0 || users.Count() > 1)
            {
                return null;
            }
            else
            {
                return users.First();
            }
        }

        private JwtSecurityToken GenerateAccessToken(string email)
        {
            var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Email, email),
        };

            var token = new JwtSecurityToken(
                issuer: _configuration["JwtSettings:Issuer"],
                audience: _configuration["JwtSettings:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(30), // Token expiration time
                signingCredentials: new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"])),
                    SecurityAlgorithms.HmacSha256)
            );

            return token;
        }

        // Returns a SafeUser object that can be sent as a response (it doesn't contain the password hash)
        private static SafeUser GetSafeUser(User user)
        {
            SafeUser su = new SafeUser();
            su.Email = user.Email;
            su.YoutubeToken = user.YoutubeToken;
            su.SpotifyToken = user.SpotifyToken;
            su.Username = user.Username;
            su.Id = user.Id;

            return su;
        }
    }
}
