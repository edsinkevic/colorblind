using System.Threading;
using System.Threading.Tasks;
using Logic.Models;
using Logic.Queries.GetParcel;
using Logic.Repositories;
using Moq;
using NUnit.Framework;

namespace Logic.Tests;

public class GetParcelQueryTest
{
        [Test]
        public async Task Should_Result_With_Parcel_If_It_Exists()
        {
                var mock = new Mock<IParcelRepository>();
                mock.Setup(p => p.FetchParcel(It.IsAny<string>())).Returns(DefaultParcel());
                var parcelQueryHandler = new GetParcelQueryHandler(mock.Object);

                var code = "123";
                var query = new GetParcelQuery(Code: code);

                var parcel = await parcelQueryHandler.Handle(query, CancellationToken.None);

                Assert.AreEqual(parcel.Value.Code, code);
        }

        [Test]
        public async Task Should_Result_With_Not_Found_If_Doesnt_Exist()
        {
                var mock = new Mock<IParcelRepository>();
                mock.Setup(p => p.FetchParcel(It.IsAny<string>())).Returns(Errors.Errors.Parcel.NotFound);
                var parcelQueryHandler = new GetParcelQueryHandler(mock.Object);

                var query = new GetParcelQuery(Code: "123");

                var parcel = await parcelQueryHandler.Handle(query, CancellationToken.None);

                Assert.AreEqual(parcel.FirstError, Errors.Errors.Parcel.NotFound);
        }

        private static Parcel DefaultParcel()
        {
                var streetAddress = new StreetAddress(Street: "Didlaukio g. 5", ApartmentNumber: "24");
                var location = new Location(StreetAddress: streetAddress);
                var parcel = new Parcel(Code: "123", Location: location);
                return parcel;
        }
}
