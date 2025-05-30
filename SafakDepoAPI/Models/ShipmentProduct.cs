namespace SafakDepoAPI.Models
{
    public class ShipmentProduct
    {
        public int ShipmentId { get; set; }
        public Shipment Shipment { get; set; }
        public int ProductId { get; set; }
        public Product Product { get; set; } 

    }
}
