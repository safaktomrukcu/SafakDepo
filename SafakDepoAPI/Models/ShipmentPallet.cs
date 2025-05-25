using System.ComponentModel.DataAnnotations;

namespace SafakDepoAPI.Models
{
    public class ShipmentPallet
    {
        [Key]
        public int Id { get; set; }
        public required int Quantity { get; set; }
        public required int PalletId { get; set; }
    }
}
