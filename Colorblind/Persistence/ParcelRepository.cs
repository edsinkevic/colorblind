using ErrorOr;
using Logic.Errors;
using Logic.Models;
using Logic.Repositories;

namespace Persistence;

public class ParcelRepository : IParcelRepository
{
        public ErrorOr<Parcel> FetchParcel(string code)
        {
                if (code == "123")
                        return Errors.Parcel.NotFound;

                var streetAddress = new StreetAddress(Street: "Didlaukio g. 5", ApartmentNumber: "24");
                var location = new Location(StreetAddress: streetAddress);

                var parcel = new Parcel(Code: code, Location: location);
                return parcel;
        }
}
