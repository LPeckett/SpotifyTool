using System.ComponentModel.DataAnnotations;

namespace SpotifyTool.Server.Models
{
    public class SafeUser
    {
        [Key]
        public int Id { get; set; }
        public string? Username { get; set; }
        public string Email { get; set; }

        public string? SpotifyToken { get; set; }
        public string? YoutubeToken { get; set; }
    }
}
