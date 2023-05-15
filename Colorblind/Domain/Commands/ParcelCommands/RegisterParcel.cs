using Domain.Values;

namespace Domain.Commands.ParcelCommands;

public record RegisterParcel(
    ParcelSize Size,
    string InvoiceEmail,
    string CouponCode,
    string TransactionCode,
    ParcelDeliveryType DeliveryType,
    SenderDeliveryInfo SenderDeliveryInfo,
    DeliveryInfo ReceiverDeliveryInfo);
