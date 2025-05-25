using System.ComponentModel.DataAnnotations;
using SafakDepoAPI.DTOs.Shipment;

namespace SafakDepoAPI.Models
{
    public class Shipment
    {
        [Key]
        public int Id { get; set; }
        public DateOnly ShipmentDate { get; set; }
        public bool IsReceived { get; set; }
        public string? Customer { get; set; }
        public int ShipmentNo { get; set; }
        public List<InboundShipmentDTO> InbountShipments { get; set; }
        public List<InboundTotalShipmentDTO> InboundTotalShipments { get; set; }
    }
}
