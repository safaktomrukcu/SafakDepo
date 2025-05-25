using System.ComponentModel.DataAnnotations;

namespace SafakDepoAPI.Models
{
    public class TotalPallet
    {
        [Key]
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }
}
