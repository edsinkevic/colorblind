using Domain.Entities;
using Domain.Events.ParcelEvents;
using Marten.Pagination;

namespace Domain.Persistence;

public interface IParcelRepository
{
    public Task<Parcel?> Get(Guid id, CancellationToken ct = default);
    public Task<IPagedList<Parcel>> List(int? pageNum, int? pageSize, CancellationToken ct = default);
    public void Create(ParcelRegistered register);
    public Task Update(Guid id, int version, Func<Parcel, object> handle, CancellationToken ct = default);
    public Task<Parcel?> GetByCode(string code, CancellationToken ct = default);
}
