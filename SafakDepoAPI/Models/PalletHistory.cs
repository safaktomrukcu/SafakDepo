namespace SafakDepoAPI.Models
{
    public class PalletHistory
    {
        public int Id { get; set; }
        public required DateOnly PalletHistoryDate { get; set; }
        public required bool IsRecieved { get; set; }
        public required int Quantity { get; set; }
    }
}
