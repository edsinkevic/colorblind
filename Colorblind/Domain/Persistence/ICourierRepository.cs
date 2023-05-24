using Domain.Entities;
using Domain.Events.CourierEvents;
using Marten.Pagination;

namespace Domain.Persistence;

public interface ICourierRepository
{
    public Task<Courier?> Get(Guid id, CancellationToken ct = default);
    public Task<Courier?> GetByName(string name, CancellationToken ct = default);
    public Task<IPagedList<Courier>> List(int? pageNum, int? pageSize, string? name, CancellationToken ct = default);
    public Task<IPagedList<Courier>> ListUnapproved(int? pageNum, int? pageSize, CancellationToken ct = default);
    public void Update(Courier courier);
    public void Create(CourierRegistered register);
}
