using Domain.DTOs;
using Domain.Persistence;

namespace Domain.UseCases.ParcelUseCases;

public class GetParcelsByCourierForTerminalUseCase
{
    private readonly IParcelRepository _parcelRepository;

    public GetParcelsByCourierForTerminalUseCase(
        IParcelRepository parcelRepository
    )
    {
        _parcelRepository = parcelRepository;
    }

    public async Task<List<ParcelToTerminalDTO>> Execute(Guid courierId, Guid terminalId, CancellationToken ct = default)
    {
        var parcels = await _parcelRepository.ListDeliverableByCourierForTerminal(courierId, terminalId, ct);
        return parcels;
    }
}
