namespace Domain.Commands.ParcelCommands;

public record DeliverParcel(string Code, Guid TerminalId, int Version);
