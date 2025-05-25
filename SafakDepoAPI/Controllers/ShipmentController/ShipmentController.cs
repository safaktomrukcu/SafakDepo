using Microsoft.AspNetCore.Mvc;
using SafakDepoAPI.Data;
using SafakDepoAPI.DTOs.Shipment;
using SafakDepoAPI.Models;

namespace SafakDepoAPI.Controllers.ShipmentController
{
    [Route("api/shipment")]
    [ApiController]
    public class ShipmentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public ShipmentController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateInboundShipment(ShipmentCreateDTO shipment)
        {
            if (shipment == null || shipment.ShipmentPallets == null || !shipment.ShipmentPallets.Any())
            {
                return BadRequest("Lütfen palet ekleyiniz...");
            }
            List<Pallet> Pallets = _context.Pallets.AddRange(
                shipment.ShipmentPallets.Select(sp => new Pallet
                {
                    Quantity = sp.Quantity,
                    Product = _context.Products.FirstOrDefault(p => p.Id == sp.PalletId) ?? throw new Exception("Ürün bulunamadı.")
                    Histories = new List<PalletHistory>
                    {
                        new PalletHistory
                        {
                            PalletHistoryDate = shipment.ShipmentDate,
                            IsRecieved = true,
                            Quantity = sp.Quantity,
                        }
                    },
                })
            );

            Shipment newShipment = new Shipment
            {
                ShipmentDate = shipment.ShipmentDate,
                IsReceived = shipment.IsReceived,
                Customer = shipment.Customer,
                ShipmentNo = _context.Shipments.Any() ? _context.Shipments.Max(s => s.ShipmentNo) + 1 : 1,
                TotalPallets = shipment.TotalPallets.Select(tp => new TotalPallet
                {
                    ProductId = tp.ProductId,
                    Quantity = tp.Quantity
                }).ToList(),
                ShipmentPallets = Pallet.Select(p => new ShipmentPallet
                {
                    PalletId = p.Id,
                    Quantity = p.Quantity
                }).ToList()

                //shipment.ShipmentPallets.Select(sp => new ShipmentPallet
                //{
                //    PalletId = sp.PalletId,
                //    Quantity = sp.Quantity
                //}).ToList()
            };
            _context.Shipments.Add(newShipment);
            await _context.SaveChangesAsync();
            return Ok(new
            {
                newShipment.Id,
                newShipment.ShipmentDate,
                newShipment.IsReceived,
                newShipment.Customer,
                newShipment.ShipmentNo
            });
        }
    }
}
