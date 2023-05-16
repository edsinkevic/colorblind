using Domain.Entities;
using Domain.Events.ParcelEvents;
using Domain.Persistence;
using Marten;
using Marten.Pagination;

namespace Persistence.Implementation;

public class ParcelRepository : IParcelRepository
{
    private readonly IDocumentSession _documentSession;

    public ParcelRepository(IDocumentSession documentSession)
    {
        _documentSession = documentSession;
    }

    public Task<Parcel?> Get(Guid id, CancellationToken ct = default) =>
        _documentSession.LoadAsync<Parcel>(id, ct);

    public Task<IPagedList<Parcel>> List(int? pageNum, int? pageSize, CancellationToken ct = default) =>
        _documentSession.Query<Parcel>()
            .ToPagedListAsync(pageNum ?? 1, pageSize ?? 10, token: ct);

    public void Create(ParcelRegistered register) =>
        _documentSession.Events.StartStream<Parcel>(register.Id, register);

    public Task Update(Guid id, int version, Func<Parcel, object> handle, CancellationToken ct = default) =>
        _documentSession.GetAndUpdate(id, version, handle, ct);

    public Task<Parcel?> GetByCode(string code, CancellationToken ct) =>
        _documentSession.Query<Parcel>().FirstOrDefaultAsync(i => i.Code == code, token: ct);

    public Task<Parcel?> GetByReceiveCode(string code, CancellationToken ct) =>
        _documentSession.Query<Parcel>().FirstOrDefaultAsync(i => i.ReceiveCode == code, token: ct);
    
}
