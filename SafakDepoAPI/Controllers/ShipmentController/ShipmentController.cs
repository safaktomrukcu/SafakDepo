using Microsoft.AspNetCore.Mvc;
using SafakDepoAPI.Data;
using SafakDepoAPI.Models;
using SafakDepoAPI.DTOs.Shipment;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Collections.Generic;
using System.Timers;

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
        [Route("inbound")]
        public async Task<IActionResult> CreateInboundShipment(InboundShipmentDTO shipment)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                Console.WriteLine(shipment);
                List<InboundJsonPalletDTO> createdPallets = new();

                foreach (InboundPalletDTO palletDto in shipment.InboundPalletsDTO)
                {
                    var pallet = new Pallet
                    {
                        PalletNumber = await _context.Pallets.AnyAsync() ? await _context.Pallets.MaxAsync(p => p.PalletNumber) + 1 : 1,
                        ProductId = palletDto.ProductId,
                        Quantity = palletDto.Quantity,
                        Location = palletDto.Location,
                    };
                    _context.Pallets.Add(pallet);
                    await _context.SaveChangesAsync();

                    Product product = await _context.Products.FindAsync(palletDto.ProductId);
                    if (product == null)
                    {
                        await transaction.RollbackAsync();
                        // Hata loglama veya özel hata mesajı dönebilirsin
                        return StatusCode(500, new { message = $"Ürün bulunamadı: {palletDto.ProductId}" });
                    }
                    var palletjson = new InboundJsonPalletDTO
                    {
                        PalletId = pallet.Id,
                        PalletNumber = pallet.PalletNumber,
                        ProductId = pallet.ProductId,
                        ProductName = product.Name,
                        ProductCode = product.Code,
                        Quantity = pallet.Quantity,
                        Location = pallet.Location,
                    };

                    createdPallets.Add(palletjson);
                }



                foreach (var Product in shipment.InboundPalletsDTO)
                {
                    Product? existingProduct = await _context.Products.FindAsync(Product.ProductId);
                    if (existingProduct != null)
                    {
                        existingProduct.Stock += Product.Quantity;
                        existingProduct.PalletStock += 1; // Palet sayısını artır
                        _context.Products.Update(existingProduct);
                    }
                    else
                    {
                        await transaction.RollbackAsync();
                        // Hata loglama veya özel hata mesajı dönebilirsin
                        return StatusCode(500, new { message = $"Gönderilen ürün bulunamadı. {Product.ProductId}" });
                    }
                    
                }

                Shipment newShipment = new Shipment
                {
                    ShipmentNumber = await _context.Shipments.AnyAsync() ? await _context.Shipments.MaxAsync(s => s.ShipmentNumber) + 1 : 1,
                    ShipmentDate = shipment.ShipmentDate,
                    Customer = "Pharmastar",
                    IsInbound = true,
                    PalletListJson = JsonSerializer.Serialize(createdPallets),
                    TotalProductListJson = JsonSerializer.Serialize(shipment.InboundTotalsDTO),
                };
                _context.Shipments.Add(newShipment);
                await _context.SaveChangesAsync();
                Console.WriteLine(newShipment.Id);

                foreach (var pallet in createdPallets)
                {
                    var shipmentPallet = new ShipmentPallet
                    {
                        ShipmentId = newShipment.Id,
                        PalletId = pallet.PalletId
                    };
                    _context.ShipmentPallets.Add(shipmentPallet);
                }

                foreach (var product in shipment.InboundTotalsDTO)
                {
                    var shipmentProduct = new ShipmentProduct
                    {
                        ShipmentId = newShipment.Id,
                        ProductId = product.ProductId,
                    };
                    _context.ShipmentProducts.Add(shipmentProduct);
                }

                await _context.SaveChangesAsync();

                await transaction.CommitAsync();
                return Ok(newShipment.Id);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                // Hata loglama veya özel hata mesajı dönebilirsin
                return StatusCode(500, new { message = "Sevkiyat oluşturulurken bir hata oluştu.", error = ex.Message });
            }
        }

        [HttpPost]
        [Route("outbound")]
        public async Task<IActionResult> CreateOutboundShipment(OutboundShipmentDTO shipment)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                List<InboundJsonPalletDTO> updatedPallets = new();

                foreach (var op in shipment.OutboundPallets)
                {
                    var pallet = _context.Pallets.FirstOrDefault(p => p.Id == op.PalletId);

                    if (pallet == null)
                    {
                        return StatusCode(404, new { message = $"Pallet not found: {op.PalletId}" });
                    }

                    Product product = _context.Products.FirstOrDefault(p => p.Id == pallet.ProductId);
                    if (product == null)
                    {
                        return StatusCode(404, new { message = $"Product not found: {pallet.ProductId}" });
                    }

                    InboundJsonPalletDTO PalletDTO = new InboundJsonPalletDTO
                    {
                        PalletId = op.PalletId,
                        PalletNumber = pallet.PalletNumber,
                        ProductId = product.Id,
                        ProductName = product.Name,
                        ProductCode = product.Code,
                        Quantity = op.Quantity,
                        Location = pallet.Location
                    };

                    updatedPallets.Add(PalletDTO);
                }

                foreach (var op in shipment.OutboundPallets)
                {
                    var pallet = _context.Pallets.FirstOrDefault(p => p.Id == op.PalletId);
                    if (pallet == null)
                    {
                        return StatusCode(404, new { message = $"Pallet not found: {op.PalletId}" });
                    }

                    var product = _context.Products.FirstOrDefault(p => p.Id == pallet.ProductId);

                    if (product == null)
                    {
                        return StatusCode(404, new { message = $"Product not found: {pallet.ProductId}" });
                    }

                    pallet.Quantity -= op.Quantity;
                    if (pallet.Quantity < 0)
                    {
                        return StatusCode(400, new { message = $"Pallet quantity cannot be negative: {pallet.Id}" });
                    }
                    else if (pallet.Quantity == 0)
                    {
                        // Palet miktarı sıfırsa sil
                        _context.Pallets.Remove(pallet);
                        product.PalletStock -= 1; // Palet sayısını azalt
                    }
                    else
                    {
                        _context.Pallets.Update(pallet);
                    }

                    product.Stock -= op.Quantity;
                    if (product.Stock < 0)
                    {
                        return StatusCode(400, new { message = $"Product stock cannot be negative: {product.Id}" });
                    }
                    _context.Products.Update(product);
                }

                Shipment newShipment = new Shipment
                {
                    ShipmentNumber = _context.Shipments.Any() ? _context.Shipments.Max(s => s.ShipmentNumber) + 1 : 1,
                    ShipmentDate = shipment.ShipmentDate,
                    Customer = shipment.Customer,
                    IsInbound = false,
                    PalletListJson = JsonSerializer.Serialize(updatedPallets),
                    TotalProductListJson = JsonSerializer.Serialize(shipment.OutboundTotals),
                };

                _context.Shipments.Add(newShipment);
                _context.SaveChanges();
                //foreach (var pallet in updatedPallets)
                //{
                //    var shipmentPallet = new ShipmentPallet
                //    {
                //        ShipmentId = newShipment.Id,
                //        PalletId = pallet.PalletId
                //    };
                //    _context.ShipmentPallets.Add(shipmentPallet);
                //}

                foreach (var product in shipment.OutboundTotals)
                {
                    var shipmentProduct = new ShipmentProduct
                    {
                        ShipmentId = newShipment.Id,
                        ProductId = product.ProductId,
                    };
                    _context.ShipmentProducts.Add(shipmentProduct);
                }
                _context.SaveChanges();

                await transaction.CommitAsync();
                return Ok(new
                {
                    ShipmentId = newShipment.Id,
                    ShipmentNumber = newShipment.ShipmentNumber,
                    ShipmentDate = newShipment.ShipmentDate,
                    Customer = newShipment.Customer,
                    IsInbound = newShipment.IsInbound,
                    PalletListJson = JsonSerializer.Deserialize<List<InboundJsonPalletDTO>>(newShipment.PalletListJson),
                    TotalProductListJson = JsonSerializer.Deserialize<List<InboundTotalDTO>>(newShipment.TotalProductListJson)
                });

            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "Sevkiyat oluşturulurken bir hata oluştu.", error = ex.Message });
            }
        }


        [HttpGet]
        public async Task<IActionResult> GetShipments([FromQuery] bool? isInbound, [FromQuery] int? productId)
        {
            try
            {
                var query = _context.Shipments
                    .Include(s => s.ShipmentProducts)
                    .AsQueryable();

                if (isInbound.HasValue)
                    query = query.Where(s => s.IsInbound == isInbound.Value);

                if (productId.HasValue)
                    query = query.Where(s => s.ShipmentProducts.Any(sp => sp.ProductId == productId.Value));

                var shipments = await query.ToListAsync();

                var shipmentDtos = shipments.Select(s => new GetShipmentDTO
                {
                    Id = s.Id,
                    ShipmentNumber = s.ShipmentNumber,
                    ShipmentDate = s.ShipmentDate,
                    Customer = s.Customer,
                    IsInbound = s.IsInbound,
                    PalletListJson = JsonSerializer.Deserialize<List<InboundJsonPalletDTO>>(s.PalletListJson),
                    TotalProductListJson = JsonSerializer.Deserialize<List<InboundTotalDTO>>(s.TotalProductListJson)
                }).ToList();

                return Ok(shipmentDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Sevkiyatlar alınırken bir hata oluştu.", error = ex.Message });
            }
        }
        [HttpGet]
        [Route("create")]
        public async Task CreateDefault()
        {
            using var client = new HttpClient();
            var baseUrl = "https://localhost:7018/api/product";
            var products = new[]
                    {
                    new { Name = "Test Product", Code = "TP001", Brand = "Test Brand", PalletQty = 10, BoxQty = 20, Weight = 2 },
                    new { Name = "Another Product", Code = "AP002", Brand = "Another Brand", PalletQty = 5, BoxQty = 15, Weight = 3 },
                    new { Name = "Sample Product", Code = "SP003", Brand = "Sample Brand", PalletQty = 8, BoxQty = 12, Weight = 4 },
                    new { Name = "Demo Product", Code = "DP004", Brand = "Demo Brand", PalletQty = 6, BoxQty = 10, Weight = 5 },
                    new { Name = "Example Product", Code = "EP005", Brand = "Example Brand", PalletQty = 4, BoxQty = 8, Weight = 6 }
                };

            foreach (var product in products)
            {
                var response = await client.PostAsJsonAsync(baseUrl, product);
                if (response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"{product.Name} eklendi.");
                }
                else
                {
                    var error = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"{product.Name} eklenemedi! Status: {response.StatusCode}, Hata: {error}");
                }
                await Task.Delay(500); // Gereksiz yüklenmeyi önlemek için kısa bekleme
            }

            // Ürünler eklendikten sonra, ID'leri dinamik olarak alıp kullanmak daha güvenli olur.
            // Ancak örnek olması için sabit ID'ler kullanıldı.
            var inboundShipment = new
            {
                ShipmentDate = "2025-01-01",
                InboundPalletsDTO = new[]
                {
            new { ProductId = 1, ProductName = "Test Product", ProductCode = "TP001", Quantity = 123, Location = "Tuzla" },
            new { ProductId = 1, ProductName = "Test Product", ProductCode = "TP001", Quantity = 123, Location = "Tuzla" }
        },
                InboundTotalsDTO = new[]
                {
            new { ProductName = "Test Product", ProductCode = "TP001", ProductId = 1, Quantity = 246 }
        }
            };

            var inboundResponse = await client.PostAsJsonAsync("https://localhost:7018/api/shipment/inbound", inboundShipment);
            if (inboundResponse.IsSuccessStatusCode)
                Console.WriteLine("Inbound shipment eklendi.");
            else
                Console.WriteLine($"Inbound shipment eklenemedi! Status: {inboundResponse.StatusCode}, Hata: {await inboundResponse.Content.ReadAsStringAsync()}");
            await Task.Delay(500);

            var outboundShipment = new
            {
                ShipmentDate = "2025-01-02",
                Customer = "Şafakku",
                OutboundPallets = new[]
                {
            new { PalletId = 1, Quantity = 50 },
            new { PalletId = 2, Quantity = 50 }
        },
                OutboundTotals = new[]
                {
            new { ProductName = "Test Product", ProductCode = "TP001", ProductId = 1, Quantity = 100 }
        }
            };

            var outboundResponse = await client.PostAsJsonAsync("https://localhost:7018/api/shipment/outbound", outboundShipment);
            if (outboundResponse.IsSuccessStatusCode)
                Console.WriteLine("Outbound shipment eklendi.");
            else
                Console.WriteLine($"Outbound shipment eklenemedi! Status: {outboundResponse.StatusCode}, Hata: {await outboundResponse.Content.ReadAsStringAsync()}");
            await Task.Delay(500);
        }

    }
}
