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
    [HttpGet("code/{code}")]
    public async Task<IActionResult> Get(
        [FromServices] GetParcelByCodeUseCase useCase,
        string code,
        CancellationToken ct)
    {
        var res = await useCase.Execute(code, ct: ct);
        return res is null
            ? Problem(statusCode: StatusCodes.Status404NotFound, title: $"Parcel with code {code} was not found!")
            : Ok(res);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> Get(
        [FromServices] GetParcelUseCase useCase,
        Guid id,
        CancellationToken ct)
    {
        var res = await useCase.Execute(id, ct: ct);
        return res is null
            ? Problem(statusCode: StatusCodes.Status404NotFound, title: $"Parcel was not found!")
            : Ok(res);
    }

    [HttpGet]
    public async Task<IActionResult> List(
        [FromServices] ListParcelsUseCase useCase,
        [FromQuery] int? pageNum,
        [FromQuery] int? pageSize,
        CancellationToken ct) =>
        Ok(await useCase.Execute(pageNum, pageSize, ct: ct));

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

    [HttpGet("terminal/{terminalId:guid}")]
    public async Task<IActionResult> GetInTerminal(
        [FromServices] GetParcelsInTerminalUseCase useCase,
        Guid terminalId,
        CancellationToken ct)
    {
        var res = await useCase.Execute(terminalId, ct);
        return Ok(res);
    }

    [HttpGet("courier/{courierId:guid}/{terminalId:guid}")]
    public async Task<IActionResult> GetByCourierForTerminal(
        [FromServices] GetParcelsByCourierForTerminalUseCase useCase,
        Guid courierId,
        Guid terminalId,
        CancellationToken ct)
    {
        var res = await useCase.Execute(courierId, terminalId, ct);
        return Ok(res);
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
        var lockerNumber = await useCase.Execute(command, ct);
        return Ok(new { lockerNumber });
    }

    [HttpPost("{code}/ship/{courierId:guid}/{lockerNumber:int}")]
    public async Task<IActionResult> Ship(
        [FromServices] ShipParcelFromTerminalUseCase useCase,
        string code,
        Guid courierId,
        int lockerNumber,
        [FromHeader(Name = "If-Match")] string eTag,
        CancellationToken ct)
    {
        var command = new ShipParcel(code, courierId, eTag.ToExpectedVersion(), lockerNumber);
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
        var lockerNumber = await useCase.Execute(command, ct);
        return Ok(new { lockerNumber });
    }

    [HttpPost("{code}/receive/{lockerNumber:int}")]
    public async Task<IActionResult> Receive(
        [FromServices] ReceiveParcelFromTerminalUseCase useCase,
        string code,
        int lockerNumber,
        [FromHeader(Name = "If-Match")] string eTag,
        CancellationToken ct)
    {
        var command = new ReceiveParcel(code, eTag.ToExpectedVersion(), lockerNumber);
        await useCase.Execute(command, ct);
        return Ok();
    }
}
