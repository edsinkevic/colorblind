using Domain.Entities;

namespace Domain.Rules;

public interface IParcelDao
{
    public Parcel FetchParcel(string code);
}
