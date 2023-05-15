using Domain.Entities;
using Domain.Events.CourierEvents;
using Marten.Pagination;

namespace Domain.Persistence;

public interface ICourierRepository
{
    public Task<Courier?> Get(Guid id, CancellationToken ct = default);
    public Task<IPagedList<Courier>> List(int? pageNum, int? pageSize, string? name, CancellationToken ct = default);
    public void Create(CourierRegistered register);
}
