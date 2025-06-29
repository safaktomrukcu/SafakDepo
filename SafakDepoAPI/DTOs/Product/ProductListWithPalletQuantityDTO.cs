namespace SafakDepoAPI.DTOs.Product
{
    public class ProductListWithPalletQuantityDTO
    {
        public int Id { get; set; }
        public string? Name { get; set; } = string.Empty;
        public string? Code { get; set; } = string.Empty;
        public string? Brand { get; set; } = string.Empty;
        public int PalletQuantity { get; set; } = 0;
        public int Stock { get; set; } = 0;
    }

}

