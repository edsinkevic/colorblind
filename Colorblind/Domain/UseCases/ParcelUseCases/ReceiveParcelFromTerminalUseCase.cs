using Domain.Commands.ParcelCommands;
using Domain.Errors;
using Domain.Events.ParcelEvents;
using Domain.Persistence;
using Domain.Values;

namespace Domain.UseCases.ParcelUseCases;

public class ReceiveParcelFromTerminalUseCase
{
    private readonly IParcelRepository _parcelRepository;
    private readonly ISaveChanges _saveChanges;

    public ReceiveParcelFromTerminalUseCase(
        IParcelRepository parcelRepository,
        ISaveChanges saveChanges
    )
    {
        _parcelRepository = parcelRepository;
        _saveChanges = saveChanges;
    }

    public async Task Execute(
        ReceiveParcel command,
        CancellationToken ct = default)
    {
        var parcel = await _parcelRepository.GetByCode(command.Code, ct);

        if (parcel is null)
        {
            throw new DomainError($"Parcel with code {command.Code} doesn't exist!");
        }

        await _parcelRepository.Update(parcel.Id, command.Version, aggregate =>
        {
            if (aggregate.Status != ParcelStatus.Delivered)
            {
                throw new DomainError("Parcel was not delivered yet!");
            }

            if (aggregate.TerminalId is null)
                throw new DomainError("Parcel isn't in a terminal!");

            return new ParcelReceived(aggregate.Id, aggregate.TerminalId.Value, command.LockerNumber);
        }, ct: ct);

        await _saveChanges.SaveChanges(ct);
    }
}
