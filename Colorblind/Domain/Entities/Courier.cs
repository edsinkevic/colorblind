using Domain.Events.CourierEvents;
using Domain.Events.ParcelEvents;

namespace Domain.Entities;

public record Courier(Guid Id,
    string Name,
    List<Guid> ParcelIds)
{
    public static Courier Create(CourierRegistered create) =>
        new Courier(create.CourierId, create.Name, new List<Guid>());

    public Courier Apply(ParcelShipped shipped) =>
        this with { ParcelIds = ParcelIds.Append(shipped.ParcelId).ToList() };

    public Courier Apply(ParcelDelivered @event)
    {
        ParcelIds.Remove(@event.ParcelId);
        return this;
    }
}
