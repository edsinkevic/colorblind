using Domain.Commands.ParcelCommands;
using Domain.Errors;
using Domain.Events.ParcelEvents;
using Domain.Persistence;
using Domain.Values;

namespace Domain.UseCases.ParcelUseCases;

public class ReceiveParcelFromTerminalUseCase
{
    private readonly IParcelRepository _parcelRepository;
    private readonly ITerminalRepository _terminalRepository;
    private readonly ISaveChanges _saveChanges;

    public ReceiveParcelFromTerminalUseCase(
        IParcelRepository parcelRepository,
        ITerminalRepository terminalRepository,
        ISaveChanges saveChanges
    )
    {
        _parcelRepository = parcelRepository;
        _terminalRepository = terminalRepository;
        _saveChanges = saveChanges;
    }

    public async Task<int> Execute(
        ReceiveParcel command,
        CancellationToken ct = default)
    {
        var parcel = await _parcelRepository.GetByCode(command.Code, ct);

        if (parcel is null)
        {
            throw new DomainError($"Parcel with code {command.Code} doesn't exist!");
        }

        if (parcel.TerminalId is null)
        {
            throw new DomainError("Parcel isn't in a terminal!");
        }

        var terminal = await _terminalRepository.Get(parcel.TerminalId.Value, ct);

        if (terminal is null)
        {
            throw new DomainError("Terminal not found");
        }

        var lockerNumber = terminal.GetLockerNumber(parcel.Id);

        await _parcelRepository.Update(parcel.Id, command.Version, aggregate =>
        {
            if (aggregate.Status != ParcelStatus.Delivered)
            {
                throw new DomainError("Parcel was not delivered yet!");
            }

            return new ParcelReceived(aggregate.Id, aggregate.TerminalId!.Value);
        }, ct: ct);

        await _saveChanges.SaveChanges(ct);

        return lockerNumber;
    }
}
