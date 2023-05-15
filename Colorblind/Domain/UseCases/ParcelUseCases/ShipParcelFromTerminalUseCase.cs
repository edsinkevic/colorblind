using Domain.Commands.ParcelCommands;
using Domain.Errors;
using Domain.Events.ParcelEvents;
using Domain.Persistence;
using Domain.Values;

namespace Domain.UseCases.ParcelUseCases;

public class ShipParcelFromTerminalUseCase
{
    private readonly IParcelRepository _parcelRepository;
    private readonly ICourierRepository _courierRepository;
    private readonly ISaveChanges _saveChanges;

    public ShipParcelFromTerminalUseCase(
        IParcelRepository parcelRepository,
        ICourierRepository courierRepository,
        ISaveChanges saveChanges
    )
    {
        _parcelRepository = parcelRepository;
        _courierRepository = courierRepository;
        _saveChanges = saveChanges;
    }

    public async Task Execute(
        ShipParcel command,
        CancellationToken ct = default)
    {
        var parcel = await _parcelRepository.GetByCode(command.Code, ct);

        if (parcel is null)
            throw new DomainError($"Parcel with code {command.Code} doesn't exist!");

        var courier = await _courierRepository.Get(command.CourierId, ct);

        if (courier is null)
            throw new DomainError("Courier not found");

        await _parcelRepository.Update(parcel.Id, command.Version, aggregate =>
        {
            if (aggregate.Status != ParcelStatus.Submitted)
                throw new DomainError(
                    "Parcel must have Submitted status!");

            return new ParcelShipped(aggregate.Id, command.CourierId);
        }, ct: ct);

        await _saveChanges.SaveChanges(ct);
    }
}
