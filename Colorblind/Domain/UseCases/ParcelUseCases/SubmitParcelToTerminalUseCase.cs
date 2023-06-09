using Domain.Commands.ParcelCommands;
using Domain.Errors;
using Domain.Events.ParcelEvents;
using Domain.Persistence;
using Domain.Values;

namespace Domain.UseCases.ParcelUseCases;

public class SubmitParcelToTerminalUseCase
{
    private readonly IParcelRepository _parcelRepository;
    private readonly ITerminalRepository _terminalRepository;
    private readonly ISaveChanges _saveChanges;

    public SubmitParcelToTerminalUseCase(
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
        SubmitParcelToTerminal command,
        CancellationToken ct = default)
    {
        var parcel = await _parcelRepository.GetByCode(command.Code, ct);

        if (parcel is null)
            throw new DomainError($"Parcel with code {command.Code} doesn't exist!");

        var terminal = await _terminalRepository.Get(command.TerminalId, ct);

        if (terminal is null)
            throw new DomainError("Terminal not found");

        if (parcel.Status != ParcelStatus.Registered)
            throw new DomainError("Parcel must have Registered status");

        var lockerNumber = terminal.GetEmptyLocker(parcel.Size);

        var @event = new ParcelSubmittedToTerminal(parcel.Id, command.TerminalId, lockerNumber);

        _parcelRepository.Update(parcel.Id, command.Version + 1, @event, ct: ct);

        await _saveChanges.SaveChanges(ct);

        return lockerNumber;
    }
}
