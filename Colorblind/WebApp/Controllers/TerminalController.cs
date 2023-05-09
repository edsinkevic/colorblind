using Domain.Entities;
using Domain.Rules;
using Marten;
using Marten.Pagination;
using Marten.Schema.Identity;
using Microsoft.AspNetCore.Mvc;
using Persistence;
using WebApp.Requests;
using static Domain.Rules.TerminalRules;

namespace WebApp.Controllers;

[ApiController]
[Route("terminals")]
public class TerminalController : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get(IDocumentSession documentSession,
        [FromQuery] int? pageSize,
        [FromQuery] int? pageNum,
        CancellationToken ct)
    {
        return Ok(await documentSession.Query<Terminal>().ToPagedListAsync(pageNum ?? 1, pageSize ?? 10, token: ct));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> Get(IDocumentSession documentSession, Guid id)
    {
        var terminal = await documentSession.Query<Terminal>().FirstOrDefaultAsync(x =>
            x.Id == id);

        return terminal is null
            ? Problem(statusCode: StatusCodes.Status404NotFound, title: "Not found")
            : Ok(terminal);
    }

    [HttpPost]
    public async Task<ActionResult> Post(IDocumentSession documentSession,
        RegisterTerminalRequest request,
        CancellationToken ct)
    {
        var id = CombGuidIdGeneration.NewGuid();

        var command = new RegisterTerminal(TerminalId: id, Address: request.Address);

        documentSession.Events.StartStream<Terminal>(id, Handle(command));

        await documentSession.SaveChangesAsync(ct);
        return Ok(new { id });
    }
}
