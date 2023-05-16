using Domain.Commands.ParcelCommands;
using Domain.Errors;
using Domain.Events.ParcelEvents;
using Domain.Persistence;
using Domain.Values;

namespace Domain.UseCases.ParcelUseCases;

public class DeliverParcelToTerminalUseCase
{
    private readonly IParcelRepository _parcelRepository;
    private readonly ITerminalRepository _terminalRepository;
    private readonly ISaveChanges _saveChanges;

    public DeliverParcelToTerminalUseCase(
        IParcelRepository parcelRepository,
        ITerminalRepository terminalRepository,
        ISaveChanges saveChanges
    )
    {
        _parcelRepository = parcelRepository;
        _terminalRepository = terminalRepository;
        _saveChanges = saveChanges;
    }

    public async Task Execute(
        DeliverParcel command,
        CancellationToken ct = default)
    {
        var parcel = await _parcelRepository.GetByCode(command.Code, ct);

        if (parcel is null)
            throw new DomainError($"Parcel with code {command.Code} doesn't exist!");

        var terminal = await _terminalRepository.Get(command.TerminalId, ct);

        if (terminal is null)
            throw new DomainError("Terminal not found");

        await _parcelRepository.Update(parcel.Id, command.Version, aggregate =>
        {
            if (aggregate.ReceiverDeliveryInfo.TerminalId != command.TerminalId)
                throw new DomainError(
                    "Parcel was delivered to wrong terminal!");

            if (aggregate.Status != ParcelStatus.Shipped)
                throw new DomainError(
                    "Parcel must have Shipped status");

            return new ParcelDelivered(aggregate.Id, command.TerminalId);
        }, ct: ct);

        await _saveChanges.SaveChanges(ct);
    }
}
