using Domain.Entities;
using Domain.Events.CourierEvents;
using Domain.Persistence;
using Marten;
using Marten.Pagination;

namespace Persistence.Implementation;

public class CourierRepository : ICourierRepository
{
    private readonly IDocumentSession _documentSession;

    public CourierRepository(IDocumentSession documentSession)
    {
        _documentSession = documentSession;
    }

    public Task<Courier?> Get(Guid id, CancellationToken ct = default) =>
        _documentSession.Query<Courier>().FirstOrDefaultAsync(x =>
            x.Id == id, token: ct);

    public Task<Courier?> GetByName(string name, CancellationToken ct = default) =>
        _documentSession.Query<Courier>().FirstOrDefaultAsync(x =>
            x.Name == name, token: ct);


    public Task<IPagedList<Courier>> List(int? pageNum, int? pageSize, string? name, CancellationToken ct = default) =>
        _documentSession.Query<Courier>()
            .Where(x => name == null || x.Name.Contains(name))
            .ToPagedListAsync(pageNum ?? 1, pageSize ?? 10, token: ct);

    public Task<IPagedList<Courier>> ListUnapproved(int? pageNum, int? pageSize, CancellationToken ct = default) =>
        _documentSession.Query<Courier>()
            .Where(x => x.IsApproved == false)
            .ToPagedListAsync(pageNum ?? 1, pageSize ?? 10, token: ct);

     public void Update(Guid id, int expectedVersionAfterAppend, object @event, CancellationToken ct = default) =>
        _documentSession.Events.Append(id, expectedVersionAfterAppend, @event);

    public void Create(CourierRegistered register) =>
        _documentSession.Events.StartStream<Courier>(register.Id, register);
}
