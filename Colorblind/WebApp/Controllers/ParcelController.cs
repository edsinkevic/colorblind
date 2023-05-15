using Domain.Commands.Parcel;
using Domain.Entities;
using Domain.Values;
using Mapster;
using Marten;
using Marten.Linq;
using Marten.Schema.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using Persistence;
using WebApp.Requests;
using static Domain.Rules.ParcelRules;


namespace WebApp.Controllers;

[ApiController]
[Route("parcels")]
public class ParcelController : ControllerBase
{
    private readonly IDocumentSession _documentSession;

    public ParcelController(IDocumentSession documentSession)
    {
        _documentSession = documentSession;
    }

    [HttpGet("{code}")]
    public async Task<IActionResult> GetDetails(
        string code,
        CancellationToken ct)
    {
        var res = await _documentSession.Query<Parcel>().FirstOrDefaultAsync(i => i.Code == code, token: ct);

        if (res is null)
        {
            return Problem(statusCode: StatusCodes.Status404NotFound, title: $"Parcel with code {code} was not found!");
        }

        var state = await _documentSession.Events.FetchStreamStateAsync(res.Id, ct);
        HttpContext.Response.Headers.Add(HeaderNames.ETag, state.Version.ToString());
        return Ok(res);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(
        RegisterParcelRequest request,
        CancellationToken ct)
    {
        var parcelId = CombGuidIdGeneration.NewGuid();
        var parcelCode = Guid.NewGuid().ToString();
        var createdDate = DateTime.Now;
        var command = request.Adapt<RegisterParcel>() with
        {
            Id = parcelId,
            Code = parcelCode,
            CreatedDate = createdDate,
        };

        _documentSession.Events.StartStream<Parcel>(parcelId, Handle(command));
        await _documentSession.SaveChangesAsync(ct);

        return Created($"parcels/{parcelCode}", new { id = parcelId, code = parcelCode });
    }

    [HttpPost("{code}/unregister")]
    public async Task<IActionResult> Unregister(
        string code,
        [FromHeader(Name = "If-Match")] string eTag,
        CancellationToken ct)
    {
        var parcel = await GetParcel(code, ct);

        if (parcel is null)
            return Problem(statusCode: 404, title: $"Parcel with code {code} doesn't exist!");

        var command = new UnregisterParcel(parcel.Id);

        await _documentSession.GetAndUpdate<Parcel>(
            parcel.Id,
            eTag.ToExpectedVersion(),
            x => Handle(x, command),
            ct
        );

        return Ok();
    }

    [HttpPost("{code}/submit/terminal/{terminalId:guid}")]
    public async Task<IActionResult> SubmitToTerminal(
        string code,
        Guid terminalId,
        [FromHeader(Name = "If-Match")] string eTag,
        CancellationToken ct)
    {
        var parcel = await GetParcel(code, ct);

        if (parcel is null)
            return Problem(statusCode: 404, title: $"Parcel with code {code} doesn't exist!");

        var exists = await _documentSession
            .Query<Terminal>()
            .AnyAsync(x => x.Id == terminalId, token: ct);

        if (!exists)
            return Problem(statusCode: 404, title: "Terminal not found");

        var command = new SubmitParcelToTerminal(parcel.Id, terminalId);

        await _documentSession.GetAndUpdate<Parcel>(
            parcel.Id,
            eTag.ToExpectedVersion(),
            x => Handle(x, command),
            ct
        );

        return Ok();
    }

    [HttpPost("{code}/ship/{courierId:guid}")]
    public async Task<IActionResult> Ship(
        string code,
        Guid courierId,
        [FromHeader(Name = "If-Match")] string eTag,
        CancellationToken ct)
    {
        var parcel = await GetParcel(code, ct);

        if (parcel is null)
            return Problem(statusCode: 404, title: $"Parcel with code {code} doesn't exist!");

        var courier = await GetCourier(courierId, ct);

        if (courier is null)
            return Problem(statusCode: 400, title: $"Courier with code {code} doesn't exist!");

        var command = new ShipParcel(parcel.Id, courierId);

        await _documentSession.GetAndUpdate<Parcel>(
            parcel.Id,
            eTag.ToExpectedVersion(),
            x => Handle(x, command),
            ct
        );

        return Ok();
    }

    [HttpPost("{code}/deliver")]
    public async Task<IActionResult> Deliver(IDocumentSession documentSession,
        string code,
        [FromHeader(Name = "If-Match")] string eTag,
        CancellationToken ct)
    {
        var parcel = await GetParcel(code, ct);

        if (parcel is null)
            return Problem(statusCode: 404, title: $"Parcel with code {code} doesn't exist!");


        var command = new DeliverParcel(parcel.Id);

        await documentSession.GetAndUpdate<Parcel>(
            parcel.Id,
            eTag.ToExpectedVersion(),
            x => Handle(x, command),
            ct
        );

        return Ok();
    }

    private Task<Parcel?> GetParcel(string code, CancellationToken ct) =>
        _documentSession
            .Query<Parcel>()
            .Where(i => i.Code == code)
            .FirstOrDefaultAsync(ct);

    private Task<Courier?> GetCourier(Guid id, CancellationToken ct) =>
        _documentSession
            .Query<Courier>().FirstOrDefaultAsync(x => x.Id == id, token: ct);
}
