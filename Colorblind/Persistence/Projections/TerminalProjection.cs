using Domain.Entities;
using Domain.Events.ParcelEvents;
using Domain.Events.TerminalEvents;
using Marten.Events.Projections;

namespace Persistence.Projections;

public class TerminalProjection : MultiStreamAggregation<Terminal, Guid>
{
    public TerminalProjection()
    {
        Identity<TerminalRegistered>(x => x.TerminalId);
        Identity<ParcelSubmittedToTerminal>(x => x.TerminalId);
    }

    public static Terminal Create(TerminalRegistered registered) =>
        Terminal.Create(registered);

    public static Terminal Handle(Terminal terminal, ParcelSubmittedToTerminal submittedToTerminal) =>
        terminal.Apply(submittedToTerminal);
}
