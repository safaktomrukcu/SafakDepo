using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SafakDepoAPI.Data;
using SafakDepoAPI.DTOs;
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
        public async Task<IActionResult> CreateProduct(ReqProductCreate product)
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

    }
}
