using Domain.Persistence;
using Domain.Entities;

namespace Domain.UseCases.CourierUseCases;

public class GetCourierUseCase
{
    private readonly ICourierRepository _courierRepository;

    public GetCourierUseCase(ICourierRepository courierRepository)
    {
        _courierRepository = courierRepository;
    }

    public Task<Courier?> Execute(Guid id, CancellationToken ct = default) =>
        _courierRepository.Get(id, ct);
}
