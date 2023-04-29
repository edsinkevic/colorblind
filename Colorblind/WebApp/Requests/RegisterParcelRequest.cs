using Domain.Values;
using Newtonsoft.Json;

namespace WebApp.Requests;

public record RegisterParcelRequest(ParcelSize Size,
    string InvoiceEmail,
    string CouponCode,
    string TransactionCode,
    ParcelDeliveryTypeRequest DeliveryType,
    SenderDeliveryInfoRequest SenderDeliveryInfo,
    DeliveryInfoRequest ReceiverDeliveryInfo);

public record SenderDeliveryInfoRequest(string Fullname,
    string PhoneNumber,
    string Email);

public record DeliveryInfoRequest(string Fullname,
    string PhoneNumber,
    string Email,
    Guid TerminalId = default!);

public record ParcelDeliveryTypeRequest(DeliveryTypeFrom From, DeliveryTypeTo To);
