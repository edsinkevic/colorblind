using Domain.Persistence;

namespace Domain.UseCases.Terminal;

public class GetTerminalUseCase
{
    private readonly ITerminalRepository _terminalRepository;

    public GetTerminalUseCase(ITerminalRepository terminalRepository)
    {
        _terminalRepository = terminalRepository;
    }

    public Task<Entities.Terminal?> Execute(Guid id, CancellationToken ct = default) =>
        _terminalRepository.Get(id, ct);
}
