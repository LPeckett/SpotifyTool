using System.ComponentModel.DataAnnotations;

namespace SpotifyTool.Server.Models
{
    public class Login
    {
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
    }
}
