using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WebAPI.Models;

namespace WebAPI
{
    public class OrderStatusUpdaterService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly TimeSpan _interval = TimeSpan.FromHours(1); // Check every hour

        public OrderStatusUpdaterService(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using (var scope = _serviceProvider.CreateScope())
                {
                    var db = scope.ServiceProvider.GetRequiredService<DatabaseContext>();
                    var now = DateTime.Now;
                    var ordersToUpdate = await db.Orders
                        .Where(o => o.Status == OrderStatus.Placed && o.DeliveryDate <= now)
                        .ToListAsync(stoppingToken);
                    
                    foreach(var order in ordersToUpdate)
                    {
                        order.Status = OrderStatus.Delivered;
                        db.Orders.Update(order);
                    }

                    if (ordersToUpdate.Count > 0)
                    {
                        await db.SaveChangesAsync(stoppingToken);
                    }
                }
                await Task.Delay(_interval, stoppingToken);
            }
        }
    }
}