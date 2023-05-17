namespace Domain.Events.ParcelEvents;

public record ParcelShipped(Guid ParcelId, Guid CourierId, Guid TerminalId);
