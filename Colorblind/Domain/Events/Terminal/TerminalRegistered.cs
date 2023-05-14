namespace Domain.Events.Terminal;

public record TerminalRegistered(Guid TerminalId, string Address);
