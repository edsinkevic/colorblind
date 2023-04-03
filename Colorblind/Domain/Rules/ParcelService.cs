using Domain.Commands.Parcel;
using Domain.Entities;
using Domain.Events.Parcel;
using Domain.Values;
using Mapster;

namespace Domain.Rules;

public static class ParcelService
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
}
