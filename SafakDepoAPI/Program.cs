using Microsoft.EntityFrameworkCore;
using SafakDepoAPI.Data;
using SafakDepoAPI.Helpers;
using SafakDepoAPI.Controllers.ProductControllers;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<ProductCodeChecker>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS ayarları
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

var app = builder.Build();

// Kullanıcıdan etkileşimli giriş almak production ortamında önerilmez.
// Bunun yerine, migration ve veritabanı işlemleri için CLI veya otomasyon tercih edilmelidir.
// Ancak, istek üzerine kodunuzu daha güvenli ve okunabilir hale getirdim.

if (args.Contains("--init-db"))
{
    Console.WriteLine("İİİİİİİİİİİİİİİİİİİİİİİ Veritabanı ve model oluşturuluyor...");
    using (var scope = app.Services.CreateScope())
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        dbContext.Database.EnsureDeleted();
        dbContext.Database.EnsureCreated();
        Console.WriteLine("Veritabanı ve model oluşturuldu. Artık API'yi kullanabilirsiniz.");
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAllOrigins");
app.UseAuthorization();
app.MapControllers();
app.Run();
