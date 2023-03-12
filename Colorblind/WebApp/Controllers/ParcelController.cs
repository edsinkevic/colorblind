using Logic;
using Logic.Models;
using Microsoft.AspNetCore.Mvc;

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
}

public record ParcelContract(Parcel Parcel);