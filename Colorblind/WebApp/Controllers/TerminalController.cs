using Domain.Commands.TerminalCommands;
using Domain.UseCases.TerminalUseCases;
using Microsoft.AspNetCore.Mvc;
using WebApp.Authorization;
using WebApp.Requests;

namespace WebApp.Controllers;

[Authorize]
[ApiController]
[Route("terminals")]
public class TerminalController : ControllerBase
{
    [AllowAnonymous]
    [HttpGet]
    public async Task<IActionResult> Get(
        [FromServices] ListTerminalsUseCase useCase,
        [FromQuery] int? pageSize,
        [FromQuery] int? pageNum,
        CancellationToken ct)
    {
        return Ok(await useCase.Execute(pageNum, pageSize, ct));
    }

    [AllowAnonymous]
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
    [AllowAnonymous]
    public async Task<IActionResult> Post(
        [FromServices] RegisterTerminalUseCase useCase,
        RegisterTerminalRequest request,
        CancellationToken ct)
    {
        var command = new RegisterTerminal(Address: request.Address, request.Lockers);
        var id = await useCase.Execute(command, ct);
        return Ok(new { id });
    }
}
