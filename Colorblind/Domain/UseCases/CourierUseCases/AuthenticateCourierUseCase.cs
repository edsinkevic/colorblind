using Domain.Commands.CourierCommands;
using Domain.Events.CourierEvents;
using Domain.Persistence;
using Domain.Errors;
using Mapster;

namespace Domain.UseCases.CourierUseCases;

public class AuthenticateCourierUseCase
{
    private readonly ICourierRepository _courierRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IJwtUtils _jwtUtils;

    public AuthenticateCourierUseCase(
        ICourierRepository courierRepository,
        IPasswordHasher passwordHasher,
        IJwtUtils jwtUtils
    )
    {
        _courierRepository = courierRepository;
        _passwordHasher = passwordHasher;
        _jwtUtils = jwtUtils;
    }

    public async Task<string> Execute(
        AuthenticateCourier command,
        CancellationToken ct = default)
    {
        var courier = await _courierRepository.GetByName(command.Name, ct);

        if (courier is null)
            throw new DomainError($"User with name {command.Name} does not exist.");

        if (!courier.IsApproved)
        {
            throw new DomainUnauthorizedError($"User with name {command.Name} wasn't approved yet.");
        }

        var isValid = _passwordHasher.VerifyPassword(command.Password, courier.HashedPassword, courier.Salt);

        if (isValid is false)
            throw new DomainError($"The password entered is incorrect.");

        var token = _jwtUtils.GenerateJwtToken(courier);

        return token;
    }
}
