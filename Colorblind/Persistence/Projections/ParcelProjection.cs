using Domain.Entities;
using Domain.Events.ParcelEvents;
using Domain.Values;
using Mapster;
using Marten.Events.Aggregation;

namespace Persistence.Projections;

public class ParcelProjection : SingleStreamAggregation<Parcel>
{
    public static Parcel Create(ParcelRegistered registered) =>
        Parcel.Create(registered);

    public static Parcel Handle(Parcel parcel, ParcelUnregistered unregistered) =>
        parcel.Apply(unregistered);

    public static Parcel Handle(Parcel parcel, ParcelSubmittedToTerminal submittedToTerminal) =>
        parcel.Apply(submittedToTerminal);

    public static Parcel Handle(Parcel parcel, ParcelShipped shipped) =>
        parcel.Apply(shipped);

    public static Parcel Handle(Parcel parcel, ParcelDelivered delivered) =>
        parcel.Apply(delivered);
}
