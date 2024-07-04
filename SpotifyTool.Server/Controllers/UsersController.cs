using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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
                return NotFound();
            }

            return GetSafeUser(user);
        }

        // PUT: api/Users/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutUser(int id, User user)
        {
            if (id != user.Id)
            {
                return BadRequest();
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Users
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<SafeUser>> Register(User user)
        {
            string password = user.Password;
            if (password == null)
            {
                return BadRequest("Please provide a password");
            }

            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);
            user.Password = hashedPassword;

            _context.User.Add(user);
            await _context.SaveChangesAsync();

            user.Password = null;

            SafeUser su = GetSafeUser(user);

            return CreatedAtAction("GetUser", new { id = su.Id }, su);
        }

        [HttpPost("login")]
        public async Task<ActionResult<User>> Login(Login user)
        {
            if (user.Email == null || user.Password == null)
            {
                return BadRequest("Please provide a email and password");
            }

            var userObj = _context.User.Where(u => u.Email == user.Email);
            if (userObj.Count() == 0 || userObj.Count() > 1)
            {
                return Unauthorized("Invalid login credentials");
            }

            string tHash = userObj.First().Password;
            if (tHash == null)
            {
                return Unauthorized("Invalid login credentials");
            }

            if (BCrypt.Net.BCrypt.Verify(user.Password, tHash))
            {
                JwtSecurityToken token = GenerateAccessToken(user.Email);
                return Ok(new {AccessToken = new JwtSecurityTokenHandler().WriteToken(token)});
            }

            return Unauthorized("Invalid login credentials");
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.User.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.User.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [Authorize]
        private bool UserExists(int id)
        {
            return _context.User.Any(e => e.Id == id);
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

        private SafeUser GetSafeUser(User user)
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
