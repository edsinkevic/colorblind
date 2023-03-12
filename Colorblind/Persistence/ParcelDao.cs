using Logic;
using Logic.Models;

namespace Persistence;

public class ParcelDao : IParcelDao
{
    public Parcel FetchParcel(string code)
    {
        var streetAddress = new StreetAddress(Street: "Didlaukio g. 5", ApartmentNumber: "24");
        var location = new Location(StreetAddress: streetAddress);

        var parcel = new Parcel(Code: code, Location: location);
        return parcel;
    }
}