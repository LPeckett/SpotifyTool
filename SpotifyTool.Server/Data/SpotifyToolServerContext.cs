using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SpotifyTool.Server.Models;

namespace SpotifyTool.Server.Data
{
    public class SpotifyToolServerContext : DbContext
    {
        public SpotifyToolServerContext (DbContextOptions<SpotifyToolServerContext> options)
            : base(options)
        {
        }

        public DbSet<SpotifyTool.Server.Models.User> User { get; set; } = default!;
    }
}
