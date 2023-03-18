using ErrorOr;
using Logic.Models;
using Logic.Repositories;
using MediatR;

namespace Logic.Queries.GetParcel;

public class GetParcelQueryHandler : IRequestHandler<GetParcelQuery, ErrorOr<Parcel>>
{
        private readonly IParcelRepository _parcelRepository;

        public GetParcelQueryHandler(IParcelRepository parcelRepository)
        {
                _parcelRepository = parcelRepository;
        }

        public async Task<ErrorOr<Parcel>> Handle(GetParcelQuery request, CancellationToken cancellationToken)
        {
                await Task.CompletedTask;
                return _parcelRepository.FetchParcel(request.Code);
        }
}
