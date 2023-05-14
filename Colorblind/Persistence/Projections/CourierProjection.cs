using Domain.Entities;
using Domain.Events.Courier;
using Domain.Events.Parcel;
using Marten.Events.Projections;

namespace Persistence.Projections;

public class CourierProjection : MultiStreamAggregation<Courier, Guid>
{
    public CourierProjection()
    {
        Identity<CourierRegistered>(x => x.CourierId);
        Identity<ParcelShipped>(x => x.CourierId);
    }

    public static Courier Create(CourierRegistered registered) =>
        Courier.Create(registered);

    public static Courier Handle(Courier courier, ParcelShipped shipped) =>
        courier.Apply(shipped);
}
