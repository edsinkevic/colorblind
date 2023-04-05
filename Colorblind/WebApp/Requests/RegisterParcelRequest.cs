using Domain.Values;

namespace WebApp.Requests;

public record RegisterParcelRequest(ParcelSize Size,
    string InvoiceEmail,
    string CouponCode,
    string TransactionCode,
    ParcelDeliveryTypeRequest DeliveryType,
    DeliveryInfoRequest SenderDeliveryInfo,
    DeliveryInfoRequest ReceiverDeliveryInfo);

public record DeliveryInfoRequest(string Fullname,
    string PhoneNumber,
    string Email,
    string ParcelLockerAddress,
    string TakeawayAddress);

public record ParcelDeliveryTypeRequest(DeliveryTypeFrom From, DeliveryTypeTo To);
