using Microsoft.EntityFrameworkCore;
using SafakDepoAPI.Data;

namespace SafakDepoAPI.Helpers
{
    public class ProductCodeChecker
    {
        private readonly ApplicationDbContext _context;
        public ProductCodeChecker(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> IsProductCodeUnique(string code)
        {
            // Check if the product code already exists in the database
            return !await _context.Products.AnyAsync(p => p.Code == code);
        }
    }
}
