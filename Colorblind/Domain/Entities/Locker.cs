using Domain.Values;

namespace Domain.Entities;

public record Locker
{
    public Locker(int number, ParcelSize size, Guid? parcelId = null)
    {
        Number = number;
        Size = size;
        ParcelId = parcelId;
    }

    public int Number { get; init; }
    public ParcelSize Size { get; init; }
    public Guid? ParcelId { get; private set; }

    public void InsertParcel(Guid parcelId) => ParcelId = parcelId;
    public bool IsEmpty => ParcelId is null;
    public void RemoveParcel() => ParcelId = null;
}