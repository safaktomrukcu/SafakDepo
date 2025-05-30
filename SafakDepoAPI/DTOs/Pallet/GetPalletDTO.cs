namespace SafakDepoAPI.DTOs.Pallet
{
    public class GetPalletDTO
    {
        public int Id { get; set; }
        public int PalletNumber { get; set; }
        public int ProductId { get; set; }
        public required string ProductName { get; set; }
        public required string ProductCode { get; set; }
        public int Quantity { get; set; } = 0;
        public required string Location { get; set; }
        
    }
}
