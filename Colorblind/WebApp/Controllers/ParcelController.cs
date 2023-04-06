using Domain.Commands.Parcel;
using Domain.Entities;
using Mapster;
using Marten;
using Marten.Pagination;
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
    public Task<IPagedList<Parcel>> GetDetails(IQuerySession querySession,
        string code,
        [FromQuery] int? pageNumber,
        [FromQuery] int? pageSize,
        CancellationToken ct) =>
        querySession.Query<Parcel>().Where(i => i.Code == code)
            .ToPagedListAsync(pageNumber ?? 1, pageSize ?? 10, ct);

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
            Id = parcelId, Code = parcelCode, CreatedDate = createdDate
        };

        await documentSession.Add<Parcel>(parcelId, Handle(command), ct);

        return Created($"parcels/{parcelCode}", parcelCode);
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

        var command = new SubmitParcelToTerminal(parcel.Id, terminalId);

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

    private Task<Parcel?> GetParcel(IDocumentSession documentSession, string code, CancellationToken ct) =>
        documentSession
            .Query<Parcel>()
            .Where(i => i.Code == code)
            .FirstOrDefaultAsync(ct);
}

public record SubmitParcelRequest(string Code, Guid TerminalId);
