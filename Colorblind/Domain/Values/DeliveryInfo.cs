namespace Domain.Values;

public record DeliveryInfo(string Fullname,
    string PhoneNumber,
    string Email,
    Guid TerminalId);
