using Logic.Models;
using Moq;
using NUnit.Framework;

namespace Logic.Tests;

public class ParcelCrudTest
{
    private ParcelCrud _parcelCrud;

    [SetUp]
    public void Setup()
    {
        var streetAddress = new StreetAddress(Street: "Didlaukio g. 5", ApartmentNumber: "24");
        var location = new Location(StreetAddress: streetAddress);

        var parcel = new Parcel(Code: "123", Location: location);

        var mock = new Mock<IParcelDao>();
        mock.Setup(p => p.FetchParcel(It.IsAny<string>())).Returns(parcel);
        _parcelCrud = new ParcelCrud(mock.Object);
    }

    [Test]
    public void Test1()
    {
        const string code = "123";
        var parcel = _parcelCrud.GetParcel(code);
        Assert.AreEqual(code, parcel.Code);
    }
}