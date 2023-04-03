using Domain.Entities;
using Domain.Events.Parcel;
using Domain.Values;
using Mapster;
using Marten.Events.Aggregation;

namespace Persistence.Projections;

public class ParcelProjection : SingleStreamAggregation<Parcel>
{
    public static Parcel Create(ParcelRegistered registered) =>
        registered.Adapt<Parcel>() with { Status = ParcelStatus.Registered };

    public static Parcel Handle(Parcel parcel, ParcelUnregistered unregistered) =>
        parcel with { Status = ParcelStatus.Unregistered };
}
