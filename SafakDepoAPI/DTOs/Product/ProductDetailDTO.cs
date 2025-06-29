namespace SafakDepoAPI.DTOs.Product
{
    public class ProductDetailDTO
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Code { get; set; }
        public string? Brand { get; set; }
        public int PalletQty { get; set; }
        public int BoxQty { get; set; }
        public int Weight { get; set; }
        public int Stock { get; set; }
        public int PalletStock { get; set; }
        public bool IsActive { get; set; }

    }
}
