using Domain.Commands.CourierCommands;
using Domain.Events.CourierEvents;
using Domain.Persistence;
using Domain.Errors;
using Mapster;

namespace Domain.UseCases.CourierUseCases;

public class ApproveCourierUseCase
{
    private readonly ICourierRepository _courierRepository;
    private readonly ISaveChanges _saveChanges;

    public ApproveCourierUseCase(
        ICourierRepository courierRepository,
        ISaveChanges saveChanges
    )
    {
        _courierRepository = courierRepository;
        _saveChanges = saveChanges;
    }

    public async Task Execute(
        ApproveCourier command,
        CancellationToken ct = default)
    {
        var courier = await _courierRepository.Get(command.Id);

        if (courier is null)
            throw new DomainError($"Courier with id {command.Id} does not exist.");

        var @event = command.Adapt<CourierApproved>();

        courier.Apply(@event);

        _courierRepository.Update(courier);

        await _saveChanges.SaveChanges(ct);
    }
}
