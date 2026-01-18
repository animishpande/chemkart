namespace WebAPI.Models;

public class Order
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public int Price { get; set; }
    public DateTime DeliveryDate { get; set; }
    public OrderStatus Status { get; set; }
}
