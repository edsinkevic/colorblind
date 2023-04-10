using Domain.Events.Parcel;

namespace Domain.Entities;

public record Terminal(Guid Id,
    string Address,
    List<Guid> ParcelIds)
{
    public static Terminal Create(TerminalRegistered create) =>
        new Terminal(create.TerminalId, create.Address, new List<Guid>());

    public Terminal Apply(ParcelSubmittedToTerminal submittedToTerminal) =>
        this with { ParcelIds = ParcelIds.Append(submittedToTerminal.ParcelId).ToList() };
}

public record TerminalRegistered(Guid TerminalId, string Address);
