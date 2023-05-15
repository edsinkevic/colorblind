using Domain.Entities;
using Domain.Events.TerminalEvents;
using Domain.Persistence;
using Marten;
using Marten.Pagination;

namespace Persistence.Implementation;

public class TerminalRepository : ITerminalRepository
{
    private readonly IDocumentSession _documentSession;

    public TerminalRepository(IDocumentSession documentSession)
    {
        _documentSession = documentSession;
    }

    public Task<Terminal?> Get(Guid id, CancellationToken ct = default) =>
        _documentSession.Query<Terminal>().FirstOrDefaultAsync(x =>
            x.Id == id, token: ct);


    public Task<IPagedList<Terminal>> List(int? pageNum, int? pageSize, CancellationToken ct = default) =>
        _documentSession.Query<Terminal>().ToPagedListAsync(pageNum ?? 1, pageSize ?? 10, token: ct);

    public void Create(TerminalRegistered register)
    {
        _documentSession.Events.StartStream<Terminal>(register.TerminalId, register);
    }
}
