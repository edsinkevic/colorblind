using Domain.Commands.ParcelCommands;
using Domain.UseCases.ParcelUseCases;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using WebApp.Requests;

namespace WebApp.Controllers;

[ApiController]
[Route("parcels")]
public class ParcelController : ControllerBase
{
    [HttpGet("{code}")]
    public async Task<IActionResult> GetDetails(
        [FromServices] GetParcelByCodeUseCase useCase,
        string code,
        CancellationToken ct)
    {
        var res = await useCase.Execute(code, ct: ct);
        return res is null
            ? Problem(statusCode: StatusCodes.Status404NotFound, title: $"Parcel with code {code} was not found!")
            : Ok(res);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(
        [FromServices] RegisterParcelUseCase useCase,
        RegisterParcelRequest request,
        CancellationToken ct)
    {
        var id = await useCase.Execute(request.Adapt<RegisterParcel>(), ct);
        return Ok(new { id });
    }

    [HttpPost("{code}/unregister")]
    public async Task<IActionResult> Unregister(
        [FromServices] UnregisterParcelUseCase useCase,
        string code,
        [FromHeader(Name = "If-Match")] string eTag,
        CancellationToken ct)
    {
        var command = new UnregisterParcel(code, eTag.ToExpectedVersion());
        await useCase.Execute(command, ct);
        return Ok();
    }

    [HttpPost("{code}/submit/terminal/{terminalId:guid}")]
    public async Task<IActionResult> SubmitToTerminal(
        [FromServices] SubmitParcelToTerminalUseCase useCase,
        string code,
        Guid terminalId,
        [FromHeader(Name = "If-Match")] string eTag,
        CancellationToken ct)
    {
        var command = new SubmitParcelToTerminal(code, terminalId, eTag.ToExpectedVersion());
        await useCase.Execute(command, ct);
        return Ok();
    }

    [HttpPost("{code}/ship/{courierId:guid}")]
    public async Task<IActionResult> Ship(
        [FromServices] ShipParcelFromTerminalUseCase useCase,
        string code,
        Guid courierId,
        [FromHeader(Name = "If-Match")] string eTag,
        CancellationToken ct)
    {
        var command = new ShipParcel(code, courierId, eTag.ToExpectedVersion());
        await useCase.Execute(command, ct);
        return Ok();
    }

    [HttpPost("{code}/deliver/terminal/{terminalId:guid}")]
    public async Task<IActionResult> Deliver(
        [FromServices] DeliverParcelToTerminalUseCase useCase,
        string code,
        Guid terminalId,
        [FromHeader(Name = "If-Match")] string eTag,
        CancellationToken ct)
    {
        var command = new DeliverParcel(code, terminalId, eTag.ToExpectedVersion());
        await useCase.Execute(command, ct);
        return Ok();
    }
}
