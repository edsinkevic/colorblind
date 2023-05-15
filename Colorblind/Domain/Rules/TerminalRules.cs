using Domain.Commands.Parcel;
using Domain.Entities;
using Domain.Events.Parcel;
using Domain.Events.Terminal;
using Mapster;

namespace Domain.Rules;

public class TerminalRules
{
    public static TerminalRegistered Handle(RegisterTerminal command)
    {
        return command.Adapt<TerminalRegistered>();
    }

    public static ParcelSubmittedToTerminal Handle(Terminal terminal, SubmitParcelToTerminal command)
    {
        return new ParcelSubmittedToTerminal(command.ParcelId, command.TerminalId);
    }
}

public record RegisterTerminal(string Address);
