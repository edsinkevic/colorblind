using Domain.Events.Parcel;
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
    ParcelStatus Status = ParcelStatus.Registered
)
{
    public static Parcel Create(ParcelRegistered registered) =>
        registered.Adapt<Parcel>();

    public Parcel Apply(ParcelSubmitted submitted) =>
        this with { Status = ParcelStatus.Submitted };

    public Parcel Apply(ParcelShipped shipped) =>
        this with { Status = ParcelStatus.Shipped };

    public Parcel Apply(ParcelDelivered delivered) =>
        this with { Status = ParcelStatus.Delivered };

    public Parcel Apply(ParcelUnregistered unregistered) =>
        this with { Status = ParcelStatus.Unregistered };
}
