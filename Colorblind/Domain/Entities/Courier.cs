using System.Text.Json.Serialization;
using Domain.Events.CourierEvents;
using Domain.Events.ParcelEvents;
using Marten.Events.CodeGeneration;

namespace Domain.Entities;

public record Courier(Guid Id,
    string Name,
    [property: JsonIgnore] string HashedPassword,
    [property: JsonIgnore] byte[] Salt,
    List<Guid> ParcelIds,
    bool IsApproved,
    [property: MartenIgnore]
    int Version)
{
    public static Courier Create(CourierRegistered create) =>
        new Courier
        (
            create.Id,
            create.Name,
            create.HashedPassword,
            create.Salt,
            new List<Guid>(),
            false,
            1
        );

    public Courier Apply(ParcelShipped shipped) =>
        this with { ParcelIds = ParcelIds.Append(shipped.ParcelId).ToList() };

    public Courier Apply(CourierApproved approved) =>
        this with { IsApproved = true, Version = Version + 1};

    public Courier Apply(ParcelDelivered @event)
    {
        ParcelIds.Remove(@event.ParcelId);
        return this;
    }
}
