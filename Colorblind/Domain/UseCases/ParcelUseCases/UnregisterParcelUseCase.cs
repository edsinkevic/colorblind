using Domain.Commands.ParcelCommands;
using Domain.Errors;
using Domain.Events.ParcelEvents;
using Domain.Persistence;
using Domain.Values;

namespace Domain.UseCases.ParcelUseCases;

public class UnregisterParcelUseCase
{
    private readonly IParcelRepository _parcelRepository;
    private readonly ISaveChanges _saveChanges;

    public UnregisterParcelUseCase(
        IParcelRepository parcelRepository,
        ISaveChanges saveChanges
    )
    {
        _parcelRepository = parcelRepository;
        _saveChanges = saveChanges;
    }

    public async Task Execute(
        UnregisterParcel command,
        CancellationToken ct = default)
    {
        var parcel = await _parcelRepository.GetByCode(command.Code, ct);
        if (parcel is null)
        {
            throw new DomainError($"Parcel with code {command.Code} doesn't exist!");
        }

        await _parcelRepository.Update(parcel.Id, command.Version, aggregate =>
        {
            if (aggregate.Status != ParcelStatus.Registered)
                throw new DomainError(
                    "Cannot unregister a parcel that passed the registration point");
            return new ParcelUnregistered(aggregate.Id);
        }, ct);

        await _saveChanges.SaveChanges(ct);
    }
}
