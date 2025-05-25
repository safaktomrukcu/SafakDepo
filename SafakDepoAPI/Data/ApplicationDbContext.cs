using Microsoft.EntityFrameworkCore;
using SafakDepoAPI.Models;

namespace SafakDepoAPI.Data
{
    public class ApplicationDbContext: DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        { }

        public DbSet<Pallet> Pallets { get; set; }
        public DbSet<PalletHistory> PalletHistories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Shipment> Shipments { get; set; }
        public DbSet<TotalPallet> TotalPallets { get; set; }


    }
}
