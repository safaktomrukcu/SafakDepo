namespace SafakDepoAPI.DTOs.Shipment
{
    public class InboundPalletDTO
    {
        public int ProductId { get; set; }
        public required string ProductName { get; set; }
        public required string ProductCode { get; set; }
        public int Quantity { get; set; }
        public required string Location { get; set; }
    }
}
