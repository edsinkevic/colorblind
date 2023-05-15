using Domain.Entities;
using Domain.Rules;
using Domain.UseCases;
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
    public async Task<IActionResult> Get(
        [FromServices] ListTerminalsUseCase useCase,
        [FromQuery] int? pageSize,
        [FromQuery] int? pageNum,
        CancellationToken ct)
    {
        return Ok(await useCase.Execute(pageNum, pageSize, ct));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> Get(
        [FromServices] GetTerminalUseCase useCase,
        Guid id,
        CancellationToken ct)
    {
        var terminal = await useCase.Execute(id, ct);

        return terminal is null
            ? Problem(statusCode: StatusCodes.Status404NotFound, title: "Not found")
            : Ok(terminal);
    }

    [HttpPost]
    public ActionResult Post(
        [FromServices] RegisterTerminalUseCase useCase,
        RegisterTerminalRequest request,
        CancellationToken ct)
    {
        var command = new RegisterTerminal(Address: request.Address);

        var id = useCase.Execute(command, ct);

        return Ok(new { id });
    }
}
