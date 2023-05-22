using Domain.Commands.TerminalCommands;
using Domain.Entities;
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

        var lockers = new List<Locker>();
        var number = 1;
        foreach (var locker in command.Lockers)
        {
            for (var i = 0; i < locker.Count; i++) 
            {
                lockers.Add(new Locker(number, locker.Size, null));
                number++;
            }
        }
        var @event = new TerminalRegistered(id, command.Address, lockers);
        _terminalRepository.Create(@event);
        await _saveChanges.SaveChanges(ct);
        return id;
    }
}
