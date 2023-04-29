using Domain.Values;

namespace Domain.Commands.Parcel;

public record RegisterParcel(Guid Id,
    string Code,
    ParcelSize Size,
    DateTime CreatedDate,
    string InvoiceEmail,
    string CouponCode,
    string TransactionCode,
    ParcelDeliveryType DeliveryType,
    SenderDeliveryInfo SenderDeliveryInfo,
    DeliveryInfo ReceiverDeliveryInfo);
