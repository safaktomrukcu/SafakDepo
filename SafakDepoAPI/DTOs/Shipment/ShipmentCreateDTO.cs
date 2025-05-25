using SafakDepoAPI.Models;

namespace SafakDepoAPI.DTOs.Shipment
{
    public class ShipmentCreateDTO
    {
        public DateOnly ShipmentDate { get; set; }
        public bool IsReceived { get; set; }
        public string? Customer { get; set; }
        public List<ShipmentPalletCreateDTO> ShipmentPallets { get; set; } = new();
        public List<TotalPalletCreateDTO> TotalPallets { get; set; } = new();
    }
}
