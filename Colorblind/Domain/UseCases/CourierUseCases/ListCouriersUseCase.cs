using Domain.Entities;
using Domain.Persistence;
using Marten.Pagination;

namespace Domain.UseCases.CourierUseCases;

public class ListCouriersUseCase
{
    private readonly ICourierRepository _courierRepository;

    public ListCouriersUseCase(ICourierRepository courierRepository)
    {
        _courierRepository = courierRepository;
    }

    public Task<IPagedList<Courier>> Execute(int? pageNum, int? pageSize, string? name, CancellationToken ct = default) =>
        _courierRepository.List(pageNum, pageSize, name, ct);
}
