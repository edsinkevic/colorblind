using Logic;
using Microsoft.AspNetCore.Mvc;
using WebApp.Contracts;

namespace WebApp.Controllers;

[ApiController]
[Route("parcels")]
public class ParcelController : ControllerBase
{
        private readonly ParcelCrud _parcelCrud;


        public ParcelController(ParcelCrud parcelCrud)
        {
                _parcelCrud = parcelCrud;
        }


        [HttpGet("{code}")]
        public ParcelContract Get(string code)
        {
                return new ParcelContract(Parcel: _parcelCrud.GetParcel(code));
        }

        [HttpPost("register")]
        public RegisterParcelResponse Register(RegisterParcelContract contract)
        {
                return new RegisterParcelResponse(RegistrationCode: "");
        }
}
