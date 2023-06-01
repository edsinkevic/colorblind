using Domain.Events.CourierEvents;
using Domain.Events.ParcelEvents;

namespace Domain.Entities;

public record Admin(Guid Id,
    string Name,
    string HashedPassword,
    byte[] Salt) : User(Id, Name, HashedPassword, Salt)
{
    //public static Admin Create(AdminRegistered create) =>
      //  new Admin(create.Id, create.Name, create.HashedPassword, create.Salt);
}
