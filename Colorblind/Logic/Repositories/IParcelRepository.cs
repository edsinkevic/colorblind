using ErrorOr;
using Logic.Models;

namespace Logic.Repositories;

public interface IParcelRepository
{
        public ErrorOr<Parcel> FetchParcel(string code);
}
