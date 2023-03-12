namespace Logic.Models;

public record Parcel(string Code, Location Location);

public record Location(StreetAddress StreetAddress);

public record StreetAddress(string Street, string ApartmentNumber);