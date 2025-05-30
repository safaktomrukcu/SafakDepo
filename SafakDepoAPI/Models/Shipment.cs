namespace SafakDepoAPI.Models
{
    public class Shipment
    {
        public int Id { get; set; }
        public int ShipmentNumber { get; set; }
        public DateOnly ShipmentDate { get; set; }
        public required string Customer { get; set; }
        public bool IsInbound { get; set; } = true;
        public required string PalletListJson { get; set; }
        public required string TotalProductListJson {       get; set; }
        public List<ShipmentProduct> ShipmentProducts { get; set; } = new();
        public List<ShipmentPallet> ShipmentPallets { get; set; } = new();
    }
}
