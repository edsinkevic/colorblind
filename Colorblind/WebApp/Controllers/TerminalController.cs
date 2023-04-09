using Domain.Entities;
using Domain.Rules;
using Marten;
using Marten.Schema.Identity;
using Microsoft.AspNetCore.Mvc;
using Persistence;
using static Domain.Rules.TerminalRules;

namespace WebApp.Controllers;

[ApiController]
[Route("terminals")]
public class TerminalController : ControllerBase
{
    [HttpGet("{id}")]
    public async Task<IActionResult> Get(IDocumentSession documentSession, string id)
    {
        if (!Guid.TryParse(id, out Guid terminalGuid))
            return Problem(statusCode: 400, title: "Terminal id is not well-formed!");

        var terminal = await documentSession.Query<Terminal>().FirstOrDefaultAsync(x =>
            x.Id == terminalGuid);

        return terminal is null
            ? Problem(statusCode: StatusCodes.Status404NotFound, title: "Not found")
            : Ok(terminal);
    }

    [HttpPost]
    public async Task<IActionResult> Post(IDocumentSession documentSession,
        RegisterTerminalRequest request,
        CancellationToken ct)
    {
        var id = CombGuidIdGeneration.NewGuid();

        var command = new RegisterTerminal(TerminalId: id, Address: request.Address);

        await documentSession.Add<Terminal>(id, Handle(command), ct: ct);

        return Ok(new { id = id });
    }
}

public record RegisterTerminalRequest(string Address);
