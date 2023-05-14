using Domain.Commands.Courier;
using Domain.Commands.Parcel;
using Domain.Entities;
using Domain.Events.Courier;
using Domain.Events.Parcel;
using Mapster;

namespace Domain.Rules;

public class CourierRules
{
    public static CourierRegistered Handle(RegisterCourier register)
    {
        return register.Adapt<CourierRegistered>();
    }

    public static ParcelShipped Handle(Courier courier, ShipParcel ship)
    {
        return new ParcelShipped(ParcelId: ship.ParcelId, CourierId: courier.Id);
    }
}
