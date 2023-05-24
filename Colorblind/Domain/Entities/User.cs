using Domain.Events.CourierEvents;
using Domain.Events.ParcelEvents;

namespace Domain.Entities;

public record User(Guid Id,
    string Name,
    string HashedPassword,
    byte[] Salt);
