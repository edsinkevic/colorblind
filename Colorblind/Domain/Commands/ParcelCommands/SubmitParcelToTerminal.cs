namespace Domain.Commands.ParcelCommands;

public record SubmitParcelToTerminal(Guid ParcelId, Guid TerminalId);
