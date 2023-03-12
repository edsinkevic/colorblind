using Logic;
using Logic.Models;

namespace Persistence;

public class ParcelDao : IParcelDao
{
    public Parcel FetchParcel(string code)
    {
        var location = new Location
        {
            StreetAddress = new StreetAddress
            {
                Street = "Didlaukio g. 5",
                ApartmentNumber = "24"
            }
        };

        var parcel = new Parcel()
        {
            Code = code,
            Location = location
        };
        return parcel;
    }
}