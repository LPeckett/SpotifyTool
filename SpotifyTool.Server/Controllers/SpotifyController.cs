using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SpotifyTool.Server.Data;
using SpotifyTool.Server.Models;

namespace SpotifyTool.Server.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class SpotifyController : ControllerBase
    {

        private readonly SpotifyToolServerContext _context;
        private readonly string _spotifySecret;
        private readonly string _spotifyId;

        public SpotifyController(SpotifyToolServerContext context)
        {
            _context = context;
            _spotifySecret = Environment.GetEnvironmentVariable("SPOTIFY_SECRET");
            _spotifyId = Environment.GetEnvironmentVariable("SPOTIFY_ID");
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<SafeUser>>> GetUser()
        {
            return Ok(new { message = _spotifyId });
        }
    }
}
