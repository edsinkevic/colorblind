using Domain.Entities;
using Domain.Persistence;
using Marten.Pagination;

namespace Domain.UseCases.CourierUseCases;

public class ListUnapprovedCouriersUseCase
{
    private readonly ICourierRepository _courierRepository;

    public ListUnapprovedCouriersUseCase(ICourierRepository courierRepository)
    {
        _courierRepository = courierRepository;
    }

    public Task<IPagedList<Courier>> Execute(int? pageNum, int? pageSize, string? name, CancellationToken ct = default) =>
        _courierRepository.ListUnapproved(pageNum, pageSize, ct);
}
