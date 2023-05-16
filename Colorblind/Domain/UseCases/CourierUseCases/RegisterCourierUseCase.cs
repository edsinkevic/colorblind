using Domain.Commands.CourierCommands;
using Domain.Events.CourierEvents;
using Domain.Persistence;
using Mapster;

namespace Domain.UseCases.CourierUseCases;

public class RegisterCourierUseCase
{
    private readonly ICourierRepository _courierRepository;
    private readonly IIdGenerator _idGenerator;
    private readonly ISaveChanges _saveChanges;

    public RegisterCourierUseCase(
        ICourierRepository courierRepository,
        IIdGenerator idGenerator,
        ISaveChanges saveChanges
    )
    {
        _courierRepository = courierRepository;
        _idGenerator = idGenerator;
        _saveChanges = saveChanges;
    }

    public async Task<Guid> Execute(
        RegisterCourier command,
        CancellationToken ct = default)
    {
        var id = _idGenerator.Generate();
        var @event = command.Adapt<CourierRegistered>() with { CourierId = id };
        _courierRepository.Create(@event);
        await _saveChanges.SaveChanges(ct);
        return id;
    }
}
