namespace SafakDepoAPI.DTOs.Shipment
{
    public class ShipmentPostDTO
    {
        public int Id { get; set; }
        public int ShipmentNumber { get; set; }
        public DateOnly ShipmentDate { get; set; }
        public required string Customer { get; set; }
        public bool IsInbound { get; set; }

        public List<InboundPalletDTO> InboundPallets { get; set; } = new();
        public List<InboundTotalDTO> InboundTotals { get; set; } = new();
    }
}
