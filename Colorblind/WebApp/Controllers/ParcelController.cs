using Domain.Commands.ParcelCommands;
using Domain.Entities;
using Domain.UseCases.ParcelUseCases;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using WebApi.Authorization;
using WebApp.Requests;
using WebApp.Responses;

namespace WebApp.Controllers;

[Authorize]
[ApiController]
[Route("parcels")]
public class ParcelController : ControllerBase
{
    [AllowAnonymous]
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

    [AllowAnonymous]
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

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<IActionResult> Register(
        [FromServices] RegisterParcelUseCase useCase,
        RegisterParcelRequest request,
        CancellationToken ct)
    {
        var id = await useCase.Execute(request.Adapt<RegisterParcel>(), ct);
        return Ok(new { id });
    }

    [AllowAnonymous]
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

    [AllowAnonymous]
    [HttpGet("terminal/{terminalId:guid}")]
    public async Task<IActionResult> GetInTerminal(
        [FromServices] GetShippableParcelsInTerminal useCase,
        Guid terminalId,
        CancellationToken ct)
    {
        var res = await useCase.Execute(terminalId, ct);

        var response = new GetShippableParcelsInTerminalResponse(res.Select(x =>
            new ShippableParcelResponse(Id: x.Parcel.Id, Size: x.Parcel.Size,
                DeliveryTerminalAddress: x.ReceivingTerminal.Address)).ToList());

        return Ok(response);
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

    [HttpPost("{code}/ship")]
    public async Task<IActionResult> Ship(
        HttpContext context,
        [FromServices] ShipParcelFromTerminalUseCase useCase,
        string code,
        [FromHeader(Name = "If-Match")] string eTag,
        CancellationToken ct)
    {
        var courier = (Courier?)context.Items["Courier"];
        if (courier is null)
            return Forbid();
        
        var command = new ShipParcel(code, courier.Id, eTag.ToExpectedVersion());
        var lockerNumber = await useCase.Execute(command, ct);
        return Ok(new { lockerNumber });
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

    [HttpGet("events/{id:guid}")]
    public async Task<IActionResult> GetWithEvents(
        [FromServices] GetParcelWithEventsUseCase useCase,
        Guid id,
        CancellationToken ct)
    {
        var res = await useCase.Execute(id, ct);
        return res is null
            ? Problem(statusCode: StatusCodes.Status404NotFound, title: $"Parcel with id {id} was not found!")
            : Ok(res);
    }

    [AllowAnonymous]
    [HttpPost("{code}/receive")]
    public async Task<IActionResult> Receive(
        [FromServices] ReceiveParcelFromTerminalUseCase useCase,
        string code,
        [FromHeader(Name = "If-Match")] string eTag,
        CancellationToken ct)
    {
        var command = new ReceiveParcel(code, eTag.ToExpectedVersion());
        var lockerNumber = await useCase.Execute(command, ct);
        return Ok(new { lockerNumber });
    }
}
