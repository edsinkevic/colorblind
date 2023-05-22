using Domain.DTOs;
using Domain.Entities;
using Domain.Errors;
using Domain.Events.ParcelEvents;
using Domain.Persistence;
using Domain.Values;
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

    public async Task<List<ParcelInTerminalDTO>> ListShippableByTerminal(Guid terminalId,
        CancellationToken ct = default)
    {
        var terminal = await _documentSession.LoadAsync<Terminal>(terminalId, ct);

        if (terminal is null)
            throw new DomainError("Terminal does not exist!");

        var destinations = new Dictionary<Guid, Terminal>();

        var parcels = await _documentSession.Query<Parcel>()
            .Include(x => x.ReceiverDeliveryInfo.TerminalId, destinations)
            .Where(x => x.TerminalId == terminalId && x.Status == ParcelStatus.Submitted)
            .ToListAsync(token: ct);

        return parcels
            .Select(x =>
                new ParcelInTerminalDTO(x.Id, x.Code, x.Version,
                    destinations[x.ReceiverDeliveryInfo.TerminalId].Address,
                    x.LockerNumber!.Value))
            .ToList();
    }

    public async Task<List<ParcelToTerminalDTO>> ListDeliverableByCourierForTerminal(Guid courierId,
        Guid terminalId,
        CancellationToken ct)
    {
        var parcels = await _documentSession.Query<Parcel>()
            .Where(i => i.ReceiverDeliveryInfo.TerminalId == terminalId && i.CourierId == courierId)
            .Select(p => new ParcelToTerminalDTO(
                p.Id,
                p.Code,
                p.Version))
            .ToListAsync(ct);

        return parcels.ToList();
    }

    public void Create(ParcelRegistered register) =>
        _documentSession.Events.StartStream<Parcel>(register.Id, register);

    public Task Update(Guid id, int version, Func<Parcel, object> handle, CancellationToken ct = default) =>
        _documentSession.GetAndUpdate(id, version, handle, ct);

    public Task<Parcel?> GetByCode(string code, CancellationToken ct) =>
        _documentSession.Query<Parcel>().FirstOrDefaultAsync(i => i.Code == code, token: ct);
}
