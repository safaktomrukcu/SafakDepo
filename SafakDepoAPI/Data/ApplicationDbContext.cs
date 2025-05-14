using Microsoft.EntityFrameworkCore;
using SafakDepoAPI.Models;

namespace SafakDepoAPI.Data
{
    public class ApplicationDbContext: DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        { }

        public DbSet<Product> Products { get; set; }


    }
}
