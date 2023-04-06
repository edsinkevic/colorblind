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
        parcel.Apply(unregistered);

    public static Parcel Handle(Parcel parcel, ParcelSubmittedToTerminal submittedToTerminal) =>
        parcel.Apply(submittedToTerminal);

    public static Parcel Handle(Parcel parcel, ParcelShipped shipped) =>
        parcel.Apply(shipped);

    public static Parcel Handle(Parcel parcel, ParcelDelivered shipped) =>
        parcel.Apply(shipped);
}
