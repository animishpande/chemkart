using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using WebAPI;
using WebAPI.DTOs;
using WebAPI.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<DatabaseContext>(options => options.UseSqlite(connectionString));

builder.Services.AddHostedService<OrderStatusUpdaterService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapGet("/", () => "Hello, App!");

app.MapGet("/orders", async (DatabaseContext db) =>
    await db.Orders.ToListAsync());

app.MapGet("/order/{name}", async (string name, DatabaseContext db) =>
{
    var order = await db.Orders.Where(o => o.Name == name).FirstOrDefaultAsync();
    if (order is null) return Results.NotFound();
    return Results.Ok(order);
});

app.MapPost("/orders", async (CreateOrderDTO orderDTO, DatabaseContext db) =>
{
    var order = await db.Orders.Where(o => o.Name == orderDTO.Name).FirstOrDefaultAsync();
    if (order is not null) return Results.BadRequest("Order already exists");
    Order newOrder = new Order
    {
        Id = Guid.NewGuid(),
        Name = orderDTO.Name,
        Price = orderDTO.Price,
        DeliveryDate = DateTime.Now.AddDays(5),
        Status = OrderStatus.Placed
    };
    db.Orders.Add(newOrder);
    await db.SaveChangesAsync();
    return Results.Ok($"Order placed for {orderDTO.Name}");
});

app.MapPatch("/orders/cancel/{name}", async (string name, DatabaseContext db) =>
{
    var order = await db.Orders.Where(o => o.Name == name).FirstOrDefaultAsync();
    if (order is null) return Results.NotFound("Order not found");
    if (order.Status == OrderStatus.Delivered)
    {
        return Results.BadRequest("Order cannot be cancelled as it is already delivered");
    }
    db.Orders.Remove(order);

    await db.SaveChangesAsync();
    return Results.Ok($"Order has been cancelled: {name}");
});

app.MapPatch("/orders/return/{name}", async (string name, DatabaseContext db) => {
    var order = await db.Orders.Where(o => o.Name == name).FirstOrDefaultAsync();
    if (order is null) return Results.NotFound("Order not found");
    if (order.Status == OrderStatus.Placed)
    {
        return Results.BadRequest("Order cannot be returned");
    }
    db.Orders.Remove(order);

    await db.SaveChangesAsync();
    return Results.Ok($"Order has been returned: {name}");
});

app.Run();

