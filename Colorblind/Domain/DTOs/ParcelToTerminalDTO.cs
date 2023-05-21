namespace Domain.DTOs;

public record ParcelToTerminalDTO(
    Guid Id,
    string Code,
    int version
);