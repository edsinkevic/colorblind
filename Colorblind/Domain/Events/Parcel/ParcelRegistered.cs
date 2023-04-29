using Domain.Values;

namespace Domain.Events.Parcel;

public record ParcelRegistered(Guid Id,
    string Code,
    ParcelSize Size,
    DateTime CreatedDate,
    string TransactionCode,
    string InvoiceEmail,
    string CouponCode,
    SenderDeliveryInfo SenderDeliveryInfo,
    DeliveryInfo ReceiverDeliveryInfo,
    ParcelDeliveryType DeliveryType
);
