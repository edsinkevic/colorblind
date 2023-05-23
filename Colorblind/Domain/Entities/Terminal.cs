using Domain.Errors;
using Domain.Events.ParcelEvents;
using Domain.Events.TerminalEvents;
using Domain.Values;

namespace Domain.Entities;

public record Terminal(Guid Id,
    string Address,
    List<Locker> Lockers)
{
    public static Terminal Create(TerminalRegistered create) =>
        new(create.TerminalId, create.Address, create.Lockers);

    public Terminal Apply(ParcelSubmittedToTerminal submittedToTerminal)
    {
        InsertParcel(submittedToTerminal.ParcelId, submittedToTerminal.LockerNumber);
        return this;
    }

    public Terminal Apply(ParcelReceived @event)
    {
        RemoveParcel(@event.ParcelId);
        return this;
    }

    public Terminal Apply(ParcelShipped @event)
    {

        RemoveParcel(@event.ParcelId);
        return this;
    }

    public Terminal Apply(ParcelDelivered @event)
    {
        InsertParcel(@event.ParcelId, @event.LockerNumber);
        return this;
    }

    public void RemoveParcel(Guid parcelId)
    {
        var locker = Lockers.Where(l => l.ParcelId == parcelId).Single();
        locker.RemoveParcel();
    }

    public int GetLockerNumber(Guid parcelId)
    {
        var locker = Lockers.Where(l => l.ParcelId == parcelId).Single();
        return locker.Number;
    }

    public void InsertParcel(Guid parcelId, int lockerNumber)
    {
        if (lockerNumber > Lockers.Count)
            throw new DomainError($"Locker {lockerNumber} does not exist");

        if (!Lockers[lockerNumber - 1].IsEmpty)
            throw new DomainError($"Locker {lockerNumber} is not empty");

        Lockers[lockerNumber - 1].InsertParcel(parcelId);
    }

    public int GetEmptyLocker(ParcelSize parcelSize)
    {
        var locker = Lockers.Where(l => l.IsEmpty && l.Size >= parcelSize).OrderBy(l => l.Size).FirstOrDefault();
        if (locker is null)
            throw new DomainError("No locker for this parcel size is currently available. Please try again later.");
        return locker.Number;
    }
}
