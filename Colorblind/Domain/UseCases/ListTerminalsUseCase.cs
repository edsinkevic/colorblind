using Domain.Entities;
using Domain.Persistence;
using Marten.Pagination;

namespace Domain.UseCases;

public class ListTerminalsUseCase
{
    private readonly ITerminalRepository _terminalRepository;

    public ListTerminalsUseCase(ITerminalRepository terminalRepository)
    {
        _terminalRepository = terminalRepository;
    }

    public Task<IPagedList<Terminal>> Execute(int? pageNum, int? pageSize, CancellationToken ct = default) =>
        _terminalRepository.List(pageNum, pageSize, ct);
}
