using Domain.DTOs;
using Domain.Entities;
using Domain.Events.ParcelEvents;
using Marten.Pagination;

namespace Domain.Persistence;

public interface IParcelRepository
{
    Task<Parcel?> Get(Guid id, CancellationToken ct = default);
    Task<IPagedList<Parcel>> List(int? pageNum, int? pageSize, CancellationToken ct = default);
    Task<List<ParcelInTerminalDTO>> ListShippableByTerminal(Guid terminalId, CancellationToken ct = default);
    void Create(ParcelRegistered register);
    Task Update(Guid id, int version, Func<Parcel, object> handle, CancellationToken ct = default);
    Task<Parcel?> GetByCode(string code, CancellationToken ct = default);
    Task<List<ParcelToTerminalDTO>> ListDeliverableByCourierForTerminal(Guid courierId, Guid terminalId, CancellationToken ct);
}
