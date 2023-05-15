namespace Domain.Events.TerminalEvents;

public record TerminalRegistered(Guid TerminalId, string Address);
