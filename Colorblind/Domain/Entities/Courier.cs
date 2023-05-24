using Domain.Events.CourierEvents;
using Domain.Events.ParcelEvents;

namespace Domain.Entities;

public record Courier(Guid Id,
    string Name,
    string HashedPassword,
    byte[] Salt,
    List<Guid> ParcelIds,
    bool isApproved) : User(Id, Name, HashedPassword, Salt)
{
    public static Courier Create(CourierRegistered create) =>
        new Courier(create.Id, create.Name, create.HashedPassword, create.Salt, new List<Guid>(), false);

    public Courier Apply(ParcelShipped shipped) =>
        this with { ParcelIds = ParcelIds.Append(shipped.ParcelId).ToList() };

    public Courier Apply(CourierApproved approved) =>
        this with { isApproved = true };

    public Courier Apply(ParcelDelivered @event)
    {
        ParcelIds.Remove(@event.ParcelId);
        return this;
    }
}
