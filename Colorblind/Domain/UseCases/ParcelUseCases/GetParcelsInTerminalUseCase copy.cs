using Domain.DTOs;
using Domain.Persistence;

namespace Domain.UseCases.ParcelUseCases;

public class GetParcelsInTerminalUseCase
{
    private readonly IParcelRepository _parcelRepository;

    public GetParcelsInTerminalUseCase(
        IParcelRepository parcelRepository
    )
    {
        _parcelRepository = parcelRepository;
    }

    public async Task<List<ParcelInTerminalDTO>> Execute(Guid terminalId, CancellationToken ct = default)
    {
        var parcels = await _parcelRepository.ListByTerminal(terminalId, ct);
        return parcels;
    }
}
