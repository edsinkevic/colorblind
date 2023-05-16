using Domain.Entities;
using Domain.Events.TerminalEvents;
using Marten.Pagination;

namespace Domain.Persistence;

public interface ITerminalRepository
{
    public Task<Terminal?> Get(Guid id, CancellationToken ct = default);
    public Task<IPagedList<Terminal>> List(int? pageNum, int? pageSize, CancellationToken ct = default);
    public void Create(TerminalRegistered register);
}
