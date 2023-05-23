namespace Domain.Commands.ParcelCommands;

public record SubmitParcelToTerminal(string Code, Guid TerminalId, int Version);
