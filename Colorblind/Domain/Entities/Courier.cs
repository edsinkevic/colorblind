using System.Text.Json.Serialization;
using Domain.Events.CourierEvents;
using Domain.Events.ParcelEvents;

namespace Domain.Entities;

public record Courier
{
    public Courier (Guid id, string name, string hashedPassword, byte[] salt, List<Guid> parcelIds, bool isApproved, int version)
    {
        Id = id;
        Name = name;
        HashedPassword = hashedPassword;
        Salt = salt;
        ParcelIds = parcelIds;
        IsApproved = isApproved;
        Version = version;
    }

    public Guid Id {get; set; }
    public string Name { get; set; }
    [JsonIgnore]
    public string HashedPassword { get; set; }
    [JsonIgnore]
    public byte[] Salt { get; set; }
    public List<Guid> ParcelIds { get; set; }
    public bool IsApproved { get; set; }
    public int Version { get; set; }

    public static Courier Create(CourierRegistered create) =>
        new Courier(create.Id, create.Name, create.HashedPassword, create.Salt, new List<Guid>(), false, 0);

    public Courier Apply(ParcelShipped shipped) =>
        this with { ParcelIds = ParcelIds.Append(shipped.ParcelId).ToList() };

    public Courier Apply(CourierApproved approved) =>
        this with { IsApproved = true };

    public Courier Apply(ParcelDelivered @event)
    {
        ParcelIds.Remove(@event.ParcelId);
        return this;
    }
}
