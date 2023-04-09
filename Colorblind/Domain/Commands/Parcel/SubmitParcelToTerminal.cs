namespace Domain.Commands.Parcel;

public record SubmitParcelToTerminal(Guid ParcelId, Guid TerminalId);
