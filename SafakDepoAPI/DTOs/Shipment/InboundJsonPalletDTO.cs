namespace SafakDepoAPI.DTOs.Shipment
{
    public class InboundJsonPalletDTO
    {
        public int PalletId { get; set; }
        public int ProductId { get; set; }
        public int PalletNumber { get; set; }
        public required string ProductName { get; set; }
        public required string ProductCode { get; set; }
        public int Quantity { get; set; }
        public required string Location { get; set; }

    }
}
