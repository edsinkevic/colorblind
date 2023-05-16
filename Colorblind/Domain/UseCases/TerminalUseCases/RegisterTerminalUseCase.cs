using Domain.Commands.TerminalCommands;
using Domain.Events.TerminalEvents;
using Domain.Persistence;
using Mapster;

namespace Domain.UseCases.TerminalUseCases;

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

    public async Task<Guid> Execute(
        RegisterTerminal command,
        CancellationToken ct = default)
    {
        var id = _idGenerator.Generate();
        var @event = command.Adapt<TerminalRegistered>() with { TerminalId = id };
        _terminalRepository.Create(@event);
        await _saveChanges.SaveChanges(ct);
        return id;
    }
}
