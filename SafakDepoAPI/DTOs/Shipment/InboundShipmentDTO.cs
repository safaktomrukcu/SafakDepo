namespace SafakDepoAPI.DTOs.Shipment
{
    public class InboundShipmentDTO
    {
        public DateOnly ShipmentDate { get; set; }
        public List<InboundPalletDTO> InboundPalletsDTO { get; set; }
        public List<InboundTotalDTO> InboundTotalsDTO { get; set; }
    }
}

