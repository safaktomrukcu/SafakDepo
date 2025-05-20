using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SafakDepoAPI.Data;
using SafakDepoAPI.DTOs.Product;
using SafakDepoAPI.Helpers;
using SafakDepoAPI.Models;

namespace SafakDepoAPI.Controllers.ProductControllers
{
    [Route("api/product")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ProductCodeChecker _productCodeChecker;
        public ProductController(ApplicationDbContext context, ProductCodeChecker productCodeChecker)
        {
            _context = context;
            _productCodeChecker = productCodeChecker;

        }

        [HttpPost]
        public async Task<IActionResult> CreateProduct(ProductCreateDTO product)
        {
            bool isProductCodeUnique = await _productCodeChecker.IsProductCodeUnique(product.Code);

            if (!isProductCodeUnique)
            {
                return BadRequest("Bu ürün kodu daha önce alınmış.");
            }

            _context.Products.Add(new Product
            {
                Name = product.Name,
                Code = product.Code,
                Brand = product.Brand,
                PalletQty = product.PalletQty,
                BoxQty = product.BoxQty,
                Weight = product.Weight
            });

            await _context.SaveChangesAsync();

            return Created(string.Empty, new { product.Name });
        }

        [HttpGet]
        public async Task<IActionResult> GetProductList()
        {
            List<Product> products = await _context.Products
                .Where(p => p.IsActive)
                .OrderBy(p => p.DisplayIndex)
                .ToListAsync();

            List<ProductListDTO> productList = products.Select(p => new ProductListDTO
            {
                Id = p.Id,
                Name = p.Name,
                Code = p.Code,
                Brand = p.Brand,
                Stock = p.Stock,
            }).ToList();

            return Ok(productList);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductDetail(int id)
        {
            Product? product = await _context.Products
                .Where(p => p.Id == id)
                .FirstOrDefaultAsync();

            if (product == null)
            {
                return NotFound(new
                {
                    message = "Ürün detayları bulunamadı."
                });
            }
            ProductDetailDTO productDetail = new ProductDetailDTO
            {
                Id = product.Id,
                Name = product.Name,
                Code = product.Code,
                Brand = product.Brand,
                PalletQty = product.PalletQty,
                BoxQty = product.BoxQty,
                Weight = product.Weight,
                Stock = product.Stock,
                PalletStock = product.PalletStock,
                IsActive = product.IsActive
            };

            return Ok(productDetail);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, ProductUpdateDTO product)
        {
            Product? existingProduct = await _context.Products
                .Where(p => p.Id == id)
                .FirstOrDefaultAsync();
            if (existingProduct == null)
            {
                return NotFound(new
                {
                    message = "Ürün bulunamadı."
                });
            }
            if (existingProduct.Code != product.Code)
            {
                bool isProductCodeUnique = await _productCodeChecker.IsProductCodeUnique(product.Code);

                if (!isProductCodeUnique)
                {
                    return BadRequest("Bu ürün kodu daha önce alınmış.");
                }
            }
            existingProduct.Name = product.Name;
            existingProduct.Code = product.Code;
            existingProduct.Brand = product.Brand;
            existingProduct.PalletQty = product.PalletQty;
            existingProduct.BoxQty = product.BoxQty;
            existingProduct.Weight = product.Weight;
            existingProduct.IsActive = product.IsActive;
            await _context.SaveChangesAsync();
            return Ok(product.Name + " güncellendi.");
        }

    }
}
