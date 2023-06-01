using Domain.DTOs;
using Domain.Entities;
using Domain.Events.ParcelEvents;
using Marten.Pagination;

namespace Domain.Persistence;

public interface IParcelRepository
{
    Task<Parcel?> Get(Guid id, CancellationToken ct = default);
    Task<ParcelWithEventsDTO?> GetWithEvents(Guid id, CancellationToken ct);
    Task<IPagedList<Parcel>> List(int? pageNum, int? pageSize, CancellationToken ct = default);
    Task<List<ShippableParcelInTerminal>> ListShippableByTerminal(Guid terminalId, CancellationToken ct = default);
    void Create(ParcelRegistered register);
    void Update(Guid id, int expectedVersionAfterAppend, object @event, CancellationToken ct = default);
    Task<Parcel?> GetByCode(string code, CancellationToken ct = default);
    Task<List<ParcelToTerminalDTO>> ListDeliverableByCourierForTerminal(Guid courierId, Guid terminalId, CancellationToken ct);
}
