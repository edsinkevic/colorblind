using Domain.Entities;
using Domain.Persistence;

namespace Domain.UseCases.ParcelUseCases;

public class GetParcelByCodeUseCase
{
    private readonly IParcelRepository _parcelRepository;

    public GetParcelByCodeUseCase(IParcelRepository parcelRepository)
    {
        _parcelRepository = parcelRepository;
    }

    public Task<Parcel?> Execute(string code, CancellationToken ct = default) =>
        _parcelRepository.GetByCode(code, ct);
}
