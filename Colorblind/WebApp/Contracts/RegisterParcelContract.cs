namespace WebApp.Contracts;

public record RegisterParcelContract(string Size, string InvoiceEmail, string CouponCode, string TransactionCode,
        ParcelDeliveryTypeContract DeliveryType,
        SenderDeliveryInfoContract SenderInfo, ReceiverDeliveryInfoContract ReceiverInfo);
