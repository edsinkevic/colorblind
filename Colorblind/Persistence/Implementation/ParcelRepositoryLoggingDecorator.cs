using Domain.DTOs;
using Domain.Entities;
using Domain.Events.ParcelEvents;
using Domain.Persistence;
using Marten.Pagination;
using Microsoft.Extensions.Logging;

namespace Persistence.Implementation;

public class ParcelRepositoryLoggingDecorator : IParcelRepository
{
    private readonly IParcelRepository _parcelRepository;
    private readonly ILogger<ParcelRepositoryLoggingDecorator> _logger;

    public ParcelRepositoryLoggingDecorator(IParcelRepository parcelRepository, ILogger<ParcelRepositoryLoggingDecorator> logger)
    {
        _parcelRepository = parcelRepository;
        _logger = logger;
    }

    public Task<Parcel?> Get(Guid id, CancellationToken ct = default)
    {
        _logger.LogInformation("Getting parcel of id={}", id);
        return _parcelRepository.Get(id, ct);
    }

    public Task<IPagedList<Parcel>> List(int? pageNum, int? pageSize, CancellationToken ct = default)
    {
        _logger.LogInformation("Listing {} parcels on page {}", pageSize, pageNum);
        return _parcelRepository.List(pageNum, pageSize, ct);
    }

    public Task<List<ParcelInTerminalDTO>> ListShippableByTerminal(Guid terminalId,
        CancellationToken ct = default)
    {
        _logger.LogInformation("Listing shippable parcels in terminal of id={}", terminalId);
        return _parcelRepository.ListShippableByTerminal(terminalId, ct);
    }

    public Task<List<ParcelToTerminalDTO>> ListDeliverableByCourierForTerminal(Guid courierId,
        Guid terminalId,
        CancellationToken ct)
    {
        _logger.LogInformation("Listing deliverable parcels in terminal of id={} by courier of id={}", terminalId,
            courierId);
        return _parcelRepository.ListDeliverableByCourierForTerminal(courierId, terminalId, ct);
    }

    public void Create(ParcelRegistered register)
    {
        _logger.LogInformation("Trying to create a parcel: {}", register);
        _parcelRepository.Create(register);
    }

    public void Update(Guid id, int expectedVersion, object @event, CancellationToken ct = default)
    {
        _logger.LogInformation("Trying to update parcel of id={} and version={}: {}", id, expectedVersion, @event);
        _parcelRepository.Update(id, expectedVersion, @event, ct);
    }

    public Task<Parcel?> GetByCode(string code, CancellationToken ct)
    {
        _logger.LogInformation("Getting parcel with code={}", code);
        return _parcelRepository.GetByCode(code, ct);
    }
}
