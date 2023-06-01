using Domain.DTOs;
using Domain.Entities;
using Domain.Persistence;

namespace Domain.UseCases.ParcelUseCases;

public class GetParcelWithEventsUseCase
{
    private readonly IParcelRepository _parcelRepository;

    public GetParcelWithEventsUseCase(IParcelRepository parcelRepository)
    {
        _parcelRepository = parcelRepository;
    }

    public Task<ParcelWithEventsDTO?> Execute(Guid id, CancellationToken ct = default) =>
        _parcelRepository.GetWithEvents(id, ct);
}
