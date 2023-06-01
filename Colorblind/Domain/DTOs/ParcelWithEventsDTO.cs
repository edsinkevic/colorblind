using Domain.Entities;

namespace Domain.DTOs;

public record ParcelWithEventsDTO(
    Parcel Parcel,
    IEnumerable<ParcelEventDTO> Events,
    string SenderTerminalAddress,
    string ReceiverTerminalAddress
);

public record ParcelEventDTO(
    string EventTypeName,
    DateTimeOffset TimeStamp,
    string? CourierName = null
);