namespace Domain.Events.ParcelEvents;

public record ParcelReceived(Guid ParcelId, Guid TerminalId);
