using Domain.Commands.Courier;
using Domain.Entities;
using Domain.Rules;
using Marten;
using Marten.Pagination;
using Marten.Schema.Identity;
using Microsoft.AspNetCore.Mvc;
using Persistence;
using WebApp.Requests;
using static Domain.Rules.CourierRules;

namespace WebApp.Controllers;

[ApiController]
[Route("couriers")]
public class CourierController : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get(IQuerySession session,
        [FromQuery] string? name,
        [FromQuery] int? pageSize,
        [FromQuery] int? pageNum,
        CancellationToken ct)
    {
        return Ok(await session.Query<Courier>()
            .Where(x => name == null || x.Name.Contains(name))
            .ToPagedListAsync(pageNum ?? 1, pageSize ?? 10, token: ct));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> Get(IQuerySession session, Guid id)
    {
        var courier = await session.Query<Courier>().FirstOrDefaultAsync(x =>
            x.Id == id);

        return courier is null
            ? Problem(statusCode: StatusCodes.Status404NotFound, title: "Not found")
            : Ok(courier);
    }

    [HttpPost]
    public async Task<ActionResult> Post(IDocumentSession documentSession,
        RegisterCourierRequest request,
        CancellationToken ct)
    {
        var id = CombGuidIdGeneration.NewGuid();

        var command = new RegisterCourier(CourierId: id, Name: request.Name);

        documentSession.Events.StartStream<Courier>(id, Handle(command));

        await documentSession.SaveChangesAsync(ct);
        return Ok(new { id });
    }
}
