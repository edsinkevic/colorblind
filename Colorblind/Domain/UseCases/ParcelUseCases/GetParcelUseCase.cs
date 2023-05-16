using Domain.Entities;
using Domain.Persistence;

namespace Domain.UseCases.ParcelUseCases;

public class GetParcelUseCase
{
    private readonly IParcelRepository _parcelRepository;

    public GetParcelUseCase(IParcelRepository parcelRepository)
    {
        _parcelRepository = parcelRepository;
    }

    public Task<Parcel?> Execute(Guid id, CancellationToken ct = default) =>
        _parcelRepository.Get(id, ct);
}
