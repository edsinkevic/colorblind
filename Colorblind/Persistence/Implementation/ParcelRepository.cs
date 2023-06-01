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

    public async Task<List<ShippableParcelInTerminal>> ListShippableByTerminal(Guid terminalId,
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
                new ShippableParcelInTerminal(x, destinations[x.ReceiverDeliveryInfo.TerminalId]))
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

    public void Update(Guid id, int expectedVersionAfterAppend, object @event, CancellationToken ct = default) =>
        _documentSession.Events.Append(id, expectedVersionAfterAppend, @event);

    public async Task<ParcelWithEventsDTO?> GetWithEvents(Guid id, CancellationToken ct)
    {
        var destinations = new Dictionary<Guid, Terminal>();

        var parcel = await _documentSession.Query<Parcel>().FirstOrDefaultAsync(parcel => parcel.Id == id, token: ct);

        if (parcel is null)
            throw new DomainError("Parcel does not exist!");

        var senderTerminalAddress = (await _documentSession.LoadAsync<Terminal>(parcel.SenderDeliveryInfo.TerminalId, ct))?.Address;
        var receiverTerminalAddress = (await _documentSession.LoadAsync<Terminal>(parcel.ReceiverDeliveryInfo.TerminalId, ct))?.Address;

        if (senderTerminalAddress is null || receiverTerminalAddress is null)
            throw new DomainError("Internal server error! Please try again later or contact support.");

        var events = (await _documentSession.Events.FetchStreamAsync(parcel.Id, token: ct))
            .Select(e =>
            {
                if (e.EventTypeName == "parcel_shipped")
                {
                    var parcelShipped = e.Data as ParcelShipped;
                    var courierName = _documentSession.Load<Courier>(parcelShipped!.CourierId)!.Name;
                    return new ParcelEventDTO(e.EventTypeName, e.Timestamp, courierName);
                }
                if (e.EventTypeName == "parcel_delivered")
                {
                    var parcelDelivered = e.Data as ParcelDelivered;
                    var courierName = _documentSession.Load<Courier>(parcelDelivered!.CourierId)!.Name;
                    return new ParcelEventDTO(e.EventTypeName, e.Timestamp, courierName);
                }
                return new ParcelEventDTO(e.EventTypeName, e.Timestamp);
            }).OrderByDescending(e => e.TimeStamp).ToList();

        return new ParcelWithEventsDTO(parcel, events, senderTerminalAddress, receiverTerminalAddress);
    }

    public Task<Parcel?> GetByCode(string code, CancellationToken ct) =>
        _documentSession.Query<Parcel>().FirstOrDefaultAsync(i => i.Code == code, token: ct);
}
