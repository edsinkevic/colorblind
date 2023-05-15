using Domain.Commands.ParcelCommands;
using Domain.Entities;
using Domain.Events.ParcelEvents;
using Domain.Values;
using Mapster;

namespace Domain.Rules;

public static class ParcelRules
{
    public static ParcelRegistered Handle(RegisterParcel command)
    {
        return command.Adapt<ParcelRegistered>();
    }

    public static ParcelUnregistered Handle(Parcel parcel, UnregisterParcel command)
    {
        if (parcel.Status != ParcelStatus.Registered)
            throw new InvalidOperationException(
                "Cannot unregister a parcel that passed the registration point");
        return new ParcelUnregistered(command.ParcelId);
    }

    public static ParcelSubmittedToTerminal Handle(Parcel parcel, SubmitParcelToTerminal command)
    {
        if (parcel.Status != ParcelStatus.Registered)
            throw new InvalidOperationException(
                "Parcel must have Registered status");

        return new ParcelSubmittedToTerminal(command.ParcelId, command.TerminalId);
    }

    public static ParcelShipped Handle(Parcel parcel, ShipParcel command)
    {
        if (parcel.Status != ParcelStatus.Submitted)
            throw new InvalidOperationException(
                "Cannot ship a parcel that was not submitted");

        return new ParcelShipped(command.ParcelId, command.CourierId);
    }

    public static ParcelDelivered Handle(Parcel parcel, DeliverParcel command)
    {
        if (parcel.Status != ParcelStatus.Shipped)
            throw new InvalidOperationException(
                "Cannot finish delivery for a parcel that was not shipped");

        if (parcel.CourierId is null)
            throw new InvalidOperationException(
                "The parcel doesn't have a courier!");

        return new ParcelDelivered(command.ParcelId);
    }
}
