namespace Domain.Events.CourierEvents;

public record CourierRegistered(Guid Id, string Name, string HashedPassword, byte[] Salt);
