using Domain.Events.ParcelEvents;
using Domain.Values;
using Mapster;

namespace Domain.Entities;

public record Parcel(Guid Id,
    string Code,
    ParcelSize Size,
    DateTime CreatedDate,
    string InvoiceEmail,
    string CouponCode,
    string TransactionCode,
    ParcelDeliveryType DeliveryType,
    DeliveryInfo SenderDeliveryInfo,
    DeliveryInfo ReceiverDeliveryInfo,
    int Version,
    ParcelStatus Status = ParcelStatus.Registered,
    Guid? TerminalId = null,
    int? LockerNumber = null,
    Guid? CourierId = null
)
{
    public static Parcel Create(ParcelRegistered registered) =>
        registered.Adapt<Parcel>() with { Status = ParcelStatus.Registered };

    public Parcel Apply(ParcelSubmittedToTerminal submittedToTerminal) =>
        this with { Status = ParcelStatus.Submitted, TerminalId = submittedToTerminal.TerminalId, LockerNumber = submittedToTerminal.LockerNumber };

    public Parcel Apply(ParcelShipped shipped) =>
        this with { Status = ParcelStatus.Shipped, CourierId = shipped.CourierId, TerminalId = null, LockerNumber = null };

    public Parcel Apply(ParcelDelivered delivered) =>
        this with { Status = ParcelStatus.Delivered, TerminalId = delivered.TerminalId, CourierId = null, LockerNumber = delivered.LockerNumber };

    public Parcel Apply(ParcelReceived @event) =>
        this with { Status = ParcelStatus.Received, TerminalId = null, LockerNumber = null };

    public Parcel Apply(ParcelUnregistered unregistered) =>
        this with { Status = ParcelStatus.Unregistered };
}
