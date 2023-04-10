using Domain.Commands.Parcel;
using Domain.Entities;
using Mapster;
using Marten;
using Marten.Schema.Identity;
using Microsoft.AspNetCore.Mvc;
using Persistence;
using WebApp.Requests;
using static Domain.Rules.ParcelRules;


namespace WebApp.Controllers;

[ApiController]
[Route("parcels")]
public class ParcelController : ControllerBase
{
    [HttpGet("{code}")]
    public async Task<IActionResult> GetDetails(IQuerySession querySession,
        string code,
        CancellationToken ct)
    {
        var res = await querySession.Query<Parcel>().FirstOrDefaultAsync(i => i.Code == code, token: ct);

        return res is null
            ? Problem(statusCode: StatusCodes.Status404NotFound, title: $"Parcel with code {code} was not found!")
            : Ok(res);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(IDocumentSession documentSession,
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
            CreatedDate = createdDate
        };

        await documentSession.Add<Parcel>(parcelId, Handle(command), ct);

        return Created($"parcels/{parcelCode}", new { id = parcelId });
    }

    [HttpPost("{code}/unregister")]
    public async Task<IActionResult> Unregister(IDocumentSession documentSession,
        string code,
        [FromHeader(Name = "If-Match")] string eTag,
        CancellationToken ct)
    {
        var parcel = await GetParcel(documentSession, code, ct);

        if (parcel is null)
            return Problem(statusCode: 404, title: $"Parcel with code {code} doesn't exist!");

        var command = new UnregisterParcel(parcel.Id);

        await documentSession.GetAndUpdate<Parcel>(
            parcel.Id,
            eTag.ToExpectedVersion(),
            x => Handle(x, command),
            ct
        );

        return Ok();
    }

    [HttpPost("{code}/submit/terminal/{terminalId}")]
    public async Task<IActionResult> SubmitToTerminal(IDocumentSession documentSession,
        string code,
        string terminalId,
        [FromHeader(Name = "If-Match")] string eTag,
        CancellationToken ct)
    {
        var parcel = await GetParcel(documentSession, code, ct);

        if (parcel is null)
            return Problem(statusCode: 404, title: $"Parcel with code {code} doesn't exist!");

        if (!Guid.TryParse(terminalId, out Guid terminalGuid))
            return Problem(statusCode: 400, title: "Terminal id is not well-formed!");

        var exists = await documentSession
            .Query<Terminal>()
            .AnyAsync(x => x.Id == terminalGuid, token: ct);

        if (!exists)
            return Problem(statusCode: 404, title: "Terminal not found");

        var command = new SubmitParcelToTerminal(parcel.Id, terminalGuid);

        await documentSession.GetAndUpdate<Parcel>(
            parcel.Id,
            eTag.ToExpectedVersion(),
            x => Handle(x, command),
            ct
        );

        return Ok();
    }

    [HttpPost("{code}/ship/{courierId}")]
    public async Task<IActionResult> Ship(IDocumentSession documentSession,
        string code,
        string courierId,
        [FromHeader(Name = "If-Match")] string eTag,
        CancellationToken ct)
    {
        var parcel = await GetParcel(documentSession, code, ct);

        if (parcel is null)
            return Problem(statusCode: 404, title: $"Parcel with code {code} doesn't exist!");

        var command = new ShipParcel(parcel.Id, courierId);

        await documentSession.GetAndUpdate<Parcel>(
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
        var parcel = await GetParcel(documentSession, code, ct);

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

    private Task<Parcel?> GetParcel(IQuerySession documentSession, string code, CancellationToken ct) =>
        documentSession
            .Query<Parcel>()
            .Where(i => i.Code == code)
            .FirstOrDefaultAsync(ct);
}
