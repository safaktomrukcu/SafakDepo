namespace SafakDepoAPI.DTOs.Shipment
{
    public class OutboundShipmentDTO
    {
        public DateOnly ShipmentDate { get; set; }
        public required string Customer { get; set; }
        public List<OutboundPalletDTO> OutboundPallets { get; set; } = new();
        public List<OutboundTotalDTO> OutboundTotals { get; set; } = new();
    }
}
