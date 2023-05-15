using Domain.Entities;
using Domain.Persistence;
using Marten.Pagination;

namespace Domain.UseCases.ParcelUseCases;

public class ListParcelsUseCase
{
    private readonly IParcelRepository _parcelRepository;

    public ListParcelsUseCase(IParcelRepository parcelRepository)
    {
        _parcelRepository = parcelRepository;
    }

    public Task<IPagedList<Parcel>> Execute(int? pageNum, int? pageSize, CancellationToken ct = default) =>
        _parcelRepository.List(pageNum, pageSize, ct);
}
