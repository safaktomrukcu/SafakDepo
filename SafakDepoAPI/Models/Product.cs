using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace SafakDepoAPI.Models
{
    [Index(nameof(Code), IsUnique = true, Name = "IX_Product_Code")]
    public class Product
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public required string Name { get; set; }
        [Required]
        public required string Code { get; set; }
        public string? Brand { get; set; }
        public string? PalletQty { get; set; }
        public string? BoxQty { get; set; }
        public string? Weight { get; set; }
        public int Stock { get; set; } = 0;
        public int PalletStock { get; set; } = 0;
        public int DisplayIndex { get; set; } = 0;
        public bool IsActive { get; set; } = true;
        public List<Pallet> Pallets { get; set; } = new();
        public List<ShipmentProduct> ShipmentProducts { get; set; } = new();
    }
}
