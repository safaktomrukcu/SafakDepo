namespace SafakDepoAPI.Models
{
    public class Pallet
    {
        public int Id { get; set; }
        public required int Quantity { get; set; }
        public required Product Product { get; set; }
        public List<PalletHistory> Histories { get; set; } = new();
        public List<ShipmentPallet> ShipmentPallets { get; set; } = new();
    }
}
