using Domain.Entities;
using Domain.Events.ParcelEvents;
using Domain.Events.TerminalEvents;
using Marten.Events.Projections;

namespace Persistence.Projections;

public class TerminalProjection : MultiStreamProjection<Terminal, Guid>
{
    public TerminalProjection()
    {
        Identity<TerminalRegistered>(x => x.TerminalId);
        Identity<ParcelSubmittedToTerminal>(x => x.TerminalId);
        Identity<ParcelDelivered>(x => x.TerminalId);
        Identity<ParcelShipped>(x => x.TerminalId);
        Identity<ParcelReceived>(x => x.TerminalId);
    }

    public static Terminal Create(TerminalRegistered registered) =>
        Terminal.Create(registered);

    public static Terminal Handle(Terminal terminal, ParcelSubmittedToTerminal submittedToTerminal) =>
        terminal.Apply(submittedToTerminal);

    public static Terminal Handle(Terminal terminal, ParcelShipped @event) =>
        terminal.Apply(@event);

    public static Terminal Handle(Terminal terminal, ParcelReceived @event) =>
        terminal.Apply(@event);

    public static Terminal Handle(Terminal terminal, ParcelDelivered @event) =>
        terminal.Apply(@event);
}
