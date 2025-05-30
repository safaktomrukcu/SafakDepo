using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SafakDepoAPI.Data;
using SafakDepoAPI.DTOs.Pallet;

namespace SafakDepoAPI.Controllers.PalletController
{
    [Route("api/[controller]")]
    [ApiController]
    public class PalletController(ApplicationDbContext context) : ControllerBase
    {
        private readonly ApplicationDbContext _context = context;


        [HttpGet]
        public async Task<IActionResult> GetPalletList([FromQuery] int? productId, [FromQuery] int? shipmentId)
        {
            try
            {
                var query = _context.Pallets.AsQueryable();

                // Ürüne göre filtrele
                if (productId.HasValue)
                    query = query.Where(p => p.ProductId == productId.Value);

                // Sevkiyata göre filtrele
                if (shipmentId.HasValue)
                {
                    query = query.Where(p => p.ShipmentPallets.Any(sp => sp.ShipmentId == shipmentId.Value));
                }

                var pallets = await query
                    .Include(p => p.Product)
                    .ToListAsync();

                List<GetPalletDTO> getPalletDTO = pallets.Select(p => new GetPalletDTO
                {
                    Id = p.Id,
                    ProductCode = p.Product.Code,
                    PalletNumber = p.PalletNumber,
                    ProductId = p.ProductId,
                    ProductName = p.Product.Name,
                    Quantity = p.Quantity,
                    Location = p.Location
                }).ToList();


                return Ok(getPalletDTO);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Paletler alınırken bir hata oluştu.",
                    error = ex.Message
                });
            }
        }

    }
}
