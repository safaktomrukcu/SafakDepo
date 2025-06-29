using System.ComponentModel.DataAnnotations;

namespace SafakDepoAPI.DTOs.Product
{
    public class ProductUpdateDTO
    {
        [Required]
        public required string Name { get; set; }
        [Required]
        public required string Code { get; set; }
        public string? Brand { get; set; }
        public int PalletQty { get; set; }
        public int BoxQty { get; set; }
        public int Weight { get; set; }
        public bool IsActive { get; set; }
    }
}
