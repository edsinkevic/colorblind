using ErrorOr;
using Logic.Models;
using MediatR;

namespace Logic.Queries.GetParcel;

public record GetParcelQuery(string Code) : IRequest<ErrorOr<Parcel>>;
