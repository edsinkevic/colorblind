using Domain.Entities;
using Domain.Events.Terminal;
using Domain.Persistence;
using Domain.Rules;
using Mapster;

namespace Domain.UseCases;

public class RegisterTerminalUseCase
{
    private readonly ITerminalRepository _terminalRepository;
    private readonly IIdGenerator _idGenerator;
    private readonly ISaveChanges _saveChanges;

    public RegisterTerminalUseCase(
        ITerminalRepository terminalRepository,
        IIdGenerator idGenerator,
        ISaveChanges saveChanges
    )
    {
        _terminalRepository = terminalRepository;
        _idGenerator = idGenerator;
        _saveChanges = saveChanges;
    }

    public Guid Execute(
        RegisterTerminal command,
        CancellationToken ct = default)
    {
        var id = _idGenerator.Generate();
        var @event = command.Adapt<TerminalRegistered>() with { TerminalId = id };
        _terminalRepository.Create(@event);
        _saveChanges.SaveChanges(ct);
        return id;
    }
}
