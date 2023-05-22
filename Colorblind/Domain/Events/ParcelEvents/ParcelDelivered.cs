namespace Domain.Events.ParcelEvents;

public record ParcelDelivered(Guid ParcelId, Guid TerminalId, Guid CourierId, int LockerNumber);
