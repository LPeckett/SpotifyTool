using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace SpotifyTool.Server.Models
{
    public class User : SafeUser
    {
        public string Password { get; set; }
        public string? RefreshToken {  get; set; }
    }
}
