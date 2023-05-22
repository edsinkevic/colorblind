namespace Domain.Events.ParcelEvents;

public record ParcelSubmittedToTerminal(Guid ParcelId, Guid TerminalId, int LockerNumber);
