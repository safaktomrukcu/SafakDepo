namespace SafakDepoAPI.DTOs.Product
{
    public class ProductListDTO
    {
        public int Id { get; set; }
        public string? Name { get; set; } = string.Empty;
        public string? Code { get; set; } = string.Empty;
        public string? Brand { get; set; } = string.Empty;
        public int Stock { get; set; } = 0;
        public int PalletStock { get; set; } = 0;
    }
}
