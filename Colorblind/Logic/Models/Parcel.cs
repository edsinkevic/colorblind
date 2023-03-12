namespace Logic.Models;

public class Parcel
{
    public string Code { get; set; }
    public Location Location { get; set; }
}

public class Location
{
    public StreetAddress StreetAddress { get; set; }
}

public class StreetAddress
{
    public string Street { get; set; }
    public string ApartmentNumber { get; set; }
}