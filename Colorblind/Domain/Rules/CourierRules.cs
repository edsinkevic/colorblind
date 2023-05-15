using Domain.Commands.CourierCommands;
using Domain.Commands.ParcelCommands;
using Domain.Entities;
using Domain.Events.CourierEvents;
using Domain.Events.ParcelEvents;
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
