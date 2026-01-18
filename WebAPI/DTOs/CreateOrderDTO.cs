using System.ComponentModel.DataAnnotations;

namespace WebAPI.DTOs;
public record CreateOrderDTO (string Name, [Range(1, int.MaxValue)] int Price);