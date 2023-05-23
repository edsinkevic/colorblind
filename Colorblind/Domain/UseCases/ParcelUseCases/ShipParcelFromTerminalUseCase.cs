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
    private readonly ITerminalRepository _terminalRepository;
    private readonly ISaveChanges _saveChanges;

    public ShipParcelFromTerminalUseCase(
        IParcelRepository parcelRepository,
        ITerminalRepository terminalRepository,
        ICourierRepository courierRepository,
        ISaveChanges saveChanges
    )
    {
        _parcelRepository = parcelRepository;
        _courierRepository = courierRepository;
        _terminalRepository = terminalRepository;
        _saveChanges = saveChanges;
    }

    public async Task<int> Execute(
        ShipParcel command,
        CancellationToken ct = default)
    {
        var parcel = await _parcelRepository.GetByCode(command.Code, ct);

        if (parcel is null)
            throw new DomainError($"Parcel with code {command.Code} doesn't exist!");

        var courier = await _courierRepository.Get(command.CourierId, ct);

        if (courier is null)
            throw new DomainError("Courier not found");

        if (parcel.TerminalId is null)
            throw new DomainError(
                "Parcel isn't in a terminal!");
        
        var terminal = await _terminalRepository.Get(parcel.TerminalId.Value, ct);

        if (terminal is null)
            throw new DomainError("Terminal not found");

        var lockerNumber = terminal.GetLockerNumber(parcel.Id);
        
        await _parcelRepository.Update(parcel.Id, command.Version, aggregate =>
        {
            if (aggregate.Status != ParcelStatus.Submitted)
                throw new DomainError(
                    "Parcel must have Submitted status!");

            return new ParcelShipped(aggregate.Id, command.CourierId, aggregate.TerminalId!.Value);
        }, ct: ct);

        await _saveChanges.SaveChanges(ct);
        return lockerNumber;
    }
}
