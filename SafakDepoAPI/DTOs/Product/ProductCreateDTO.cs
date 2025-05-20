using System.ComponentModel.DataAnnotations;

namespace SafakDepoAPI.DTOs.Product
{
    public class ProductCreateDTO
    {
        [Required]
        public required string Name { get; set; }
        [Required]
        public required string Code { get; set; }
        public string? Brand { get; set; }
        public string? PalletQty { get; set; }
        public string? BoxQty { get; set; }
        public string? Weight { get; set; }

    }
}
