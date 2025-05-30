namespace SafakDepoAPI.Models
{
    public class PalletInShipment
    {
        public int Id { get; set; }
        public int ShipmentId { get; set; }
        public Shipment Shipment { get; set; } = null!;
        public int PalletId { get; set; }
        public Pallet Pallet { get; set; } = null!;
        public int Quantity { get; set; }
        public string Location { get; set; } = null!;
    }
}
