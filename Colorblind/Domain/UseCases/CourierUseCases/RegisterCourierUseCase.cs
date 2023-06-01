using Domain.Commands.CourierCommands;
using Domain.Events.CourierEvents;
using Domain.Persistence;
using Mapster;
using Domain.Errors;

namespace Domain.UseCases.CourierUseCases;

public class RegisterCourierUseCase
{
    private readonly ICourierRepository _courierRepository;
    private readonly IIdGenerator _idGenerator;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ISaveChanges _saveChanges;

    public RegisterCourierUseCase(
        ICourierRepository courierRepository,
        IIdGenerator idGenerator,
        IPasswordHasher passwordHasher,
        ISaveChanges saveChanges
    )
    {
        _courierRepository = courierRepository;
        _idGenerator = idGenerator;
        _passwordHasher = passwordHasher;
        _saveChanges = saveChanges;
    }

    public async Task<Guid> Execute(
        RegisterCourier command,
        CancellationToken ct = default)
    {
        var courierExists = await _courierRepository.GetByName(command.Name, ct);

        if(courierExists is not null)
            throw new DomainError($"A courier with the name {command.Name} already exists!");

        var id = _idGenerator.Generate();
        var hash = _passwordHasher.HashPassword(command.Password, out var salt);
        var @event = command.Adapt<CourierRegistered>() with { Id = id, HashedPassword = hash, Salt = salt};
        _courierRepository.Create(@event);
        await _saveChanges.SaveChanges(ct);
        return id;
    }
}
