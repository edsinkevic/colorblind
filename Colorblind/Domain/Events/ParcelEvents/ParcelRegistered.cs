using Domain.Values;

namespace Domain.Events.ParcelEvents;

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
