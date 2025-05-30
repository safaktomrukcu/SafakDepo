using SafakDepoAPI.Models;

namespace SafakDepoAPI.DTOs.Shipment
{
    public class GetShipmentDTO
    {
        public int Id { get; set; }
        public int ShipmentNumber { get; set; }
        public DateOnly ShipmentDate { get; set; }
        public required string Customer { get; set; }
        public bool IsInbound { get; set; }
        public required List<InboundJsonPalletDTO> PalletListJson { get; set; }
        public required List<InboundTotalDTO> TotalProductListJson { get; set; }
    }
}
