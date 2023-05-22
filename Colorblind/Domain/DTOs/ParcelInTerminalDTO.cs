namespace Domain.DTOs;

public record ParcelInTerminalDTO(
    Guid Id,
    string Code,
    int version,
    string DeliveryTerminalAddress,
    int LockerNumber
);