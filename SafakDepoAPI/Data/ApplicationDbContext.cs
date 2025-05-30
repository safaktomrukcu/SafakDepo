using Microsoft.AspNetCore.Components.Server.ProtectedBrowserStorage;
using Microsoft.EntityFrameworkCore;
using SafakDepoAPI.Models;

namespace SafakDepoAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        { }

        public DbSet<Product> Products { get; set; }
        public DbSet<Pallet> Pallets { get; set; }
        public DbSet<Shipment> Shipments { get; set; }
        public DbSet<ShipmentProduct> ShipmentProducts { get; set; }
        public DbSet<ShipmentPallet> ShipmentPallets { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ShipmentPallet>()
                .HasKey(sp => new { sp.ShipmentId, sp.PalletId });
            modelBuilder.Entity<ShipmentPallet>()
                .HasOne(sp=> sp.Shipment)
                .WithMany(s => s.ShipmentPallets)
                .HasForeignKey(sp => sp.ShipmentId);
            modelBuilder.Entity<ShipmentPallet>()
                .HasOne(sp => sp.Pallet)
                .WithMany(p => p.ShipmentPallets)
                .HasForeignKey(sp => sp.PalletId);

            modelBuilder.Entity<ShipmentProduct>()
                .HasKey(sp => new { sp.ShipmentId, sp.ProductId });
            modelBuilder.Entity<ShipmentProduct>()
                .HasOne(sp => sp.Shipment)
                .WithMany(s => s.ShipmentProducts)
                .HasForeignKey(sp => sp.ShipmentId);
            modelBuilder.Entity<ShipmentProduct>()
                .HasOne(sp => sp.Product)
                .WithMany(p => p.ShipmentProducts)
                .HasForeignKey(sp => sp.ProductId);

            modelBuilder.Entity<Pallet>()
                .HasOne(p => p.Product)
                .WithMany(pr => pr.Pallets)
                .HasForeignKey(p => p.ProductId);
        }
    }}

