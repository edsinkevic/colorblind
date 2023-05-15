using Domain.Events.Courier;
using Domain.Events.Parcel;

namespace Domain.Entities;

public record Courier(Guid Id,
    string Name,
    List<Guid> ParcelIds)
{
    public static Courier Create(CourierRegistered create) =>
        new Courier(create.CourierId, create.Name, new List<Guid>());

    public Courier Apply(ParcelShipped shipped) =>
        this with { ParcelIds = ParcelIds.Append(shipped.ParcelId).ToList() };
}
