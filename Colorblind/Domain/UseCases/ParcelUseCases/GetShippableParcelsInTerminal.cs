using Domain.DTOs;
using Domain.Persistence;

namespace Domain.UseCases.ParcelUseCases;

public class GetShippableParcelsInTerminal
{
    private readonly IParcelRepository _parcelRepository;

    public GetShippableParcelsInTerminal(
        IParcelRepository parcelRepository
    )
    {
        _parcelRepository = parcelRepository;
    }

    public async Task<List<ShippableParcelInTerminal>> Execute(Guid terminalId, CancellationToken ct = default)
    {
        var parcels = await _parcelRepository.ListShippableByTerminal(terminalId, ct);
        return parcels;
    }
}
