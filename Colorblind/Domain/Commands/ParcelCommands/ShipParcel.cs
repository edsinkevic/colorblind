namespace Domain.Commands.ParcelCommands;

public record ShipParcel(string Code, Guid CourierId, int Version);
