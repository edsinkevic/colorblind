using Domain.Entities;
using Domain.Events.CourierEvents;
using Domain.Events.ParcelEvents;
using Marten.Events.Projections;

namespace Persistence.Projections;

public class CourierProjection : MultiStreamProjection<Courier, Guid>
{
    public CourierProjection()
    {
        Identity<CourierRegistered>(x => x.Id);
        Identity<ParcelShipped>(x => x.CourierId);
        Identity<ParcelDelivered>(x => x.CourierId);
        Identity<CourierApproved>(x => x.Id);
    }

    public static Courier Create(CourierRegistered registered) =>
        Courier.Create(registered);

    public static Courier Handle(Courier courier, ParcelShipped shipped) =>
        courier.Apply(shipped);

    public static Courier Handle(Courier courier, CourierApproved @event) =>
        courier.Apply(@event);
    
    public static Courier Handle(Courier courier, ParcelDelivered @event) =>
        courier.Apply(@event);
}
