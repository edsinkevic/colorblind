namespace WebApp.Contracts;

public record SenderDeliveryInfoContract(string Fullname, string PhoneNumber, string Email,
        string? ParcelLockerAddress, string? TakeawayAdress);
