using Domain.Entities;
using Domain.Persistence;

namespace Domain.UseCases.TerminalUseCases;

public class GetTerminalUseCase
{
    private readonly ITerminalRepository _terminalRepository;

    public GetTerminalUseCase(ITerminalRepository terminalRepository)
    {
        _terminalRepository = terminalRepository;
    }

    public Task<Terminal?> Execute(Guid id, CancellationToken ct = default) =>
        _terminalRepository.Get(id, ct);
}
