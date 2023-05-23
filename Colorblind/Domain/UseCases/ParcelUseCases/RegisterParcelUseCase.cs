using Domain.Commands.ParcelCommands;
using Domain.Errors;
using Domain.Events.ParcelEvents;
using Domain.Persistence;
using Mapster;

namespace Domain.UseCases.ParcelUseCases;

public class RegisterParcelUseCase
{
    private readonly IParcelRepository _parcelRepository;
    private readonly ITerminalRepository _terminalRepository;
    private readonly IIdGenerator _idGenerator;
    private readonly ISaveChanges _saveChanges;

    public RegisterParcelUseCase(
        IParcelRepository parcelRepository,
        ITerminalRepository terminalRepository,
        IIdGenerator idGenerator,
        ISaveChanges saveChanges
    )
    {
        _parcelRepository = parcelRepository;
        _terminalRepository = terminalRepository;
        _idGenerator = idGenerator;
        _saveChanges = saveChanges;
    }

    public async Task<Guid> Execute(
        RegisterParcel command,
        CancellationToken ct = default)
    {
        var fromTerminalId = command.SenderDeliveryInfo.TerminalId;
        var toTerminalId = command.ReceiverDeliveryInfo.TerminalId;
        if (fromTerminalId == toTerminalId)
            throw new DomainError("Source and destination terminals cannot be the same!");

        var fromTerminal = await _terminalRepository.Get(fromTerminalId, ct);
        if (fromTerminal is null)
        {
            throw new DomainError($"Terminal {fromTerminalId} doesn't exist!");
        }

        var toTerminal = await _terminalRepository.Get(toTerminalId, ct);
        if (toTerminal is null)
        {
            throw new DomainError($"Terminal {toTerminalId} doesn't exist!");
        }

        var id = _idGenerator.Generate();
        var code = _idGenerator.Generate().ToString();
        var date = DateTime.Now;
        var @event = command.Adapt<ParcelRegistered>() with { Id = id, Code = code, CreatedDate = date };
        _parcelRepository.Create(@event);
        await _saveChanges.SaveChanges(ct);
        return id;
    }
}
