using Domain.Commands.CourierCommands;
using Domain.UseCases.CourierUseCases;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using WebApp.Requests;
using WebApp.Authorization;

namespace WebApp.Controllers;

[Authorize]
[ApiController]
[Route("couriers")]
public class CourierController : ControllerBase
{
    [AllowAnonymous]
    [HttpGet]
    public async Task<IActionResult> Get(
        [FromServices] ListCouriersUseCase useCase,
        [FromQuery] string? name,
        [FromQuery] int? pageSize,
        [FromQuery] int? pageNum,
        CancellationToken ct) =>
        Ok(await useCase.Execute(pageNum, pageSize, name, ct));

    [AllowAnonymous]
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> Get([FromServices] GetCourierUseCase useCase, Guid id, CancellationToken ct)
    {
        var courier = await useCase.Execute(id, ct);

        return courier is null
            ? Problem(statusCode: StatusCodes.Status404NotFound, title: "Not found")
            : Ok(courier);
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<ActionResult> Post([FromServices] RegisterCourierUseCase useCase,
        RegisterCourierRequest request,
        CancellationToken ct)
    {
        var command = request.Adapt<RegisterCourier>();
        var id = await useCase.Execute(command, ct);
        return Ok(new { id });
    }

    [AllowAnonymous]
    [HttpPost("authenticate")]
    public async Task<ActionResult> Authenticate(
        [FromServices] AuthenticateCourierUseCase useCase,
        AuthenticateCourierRequest request,
        CancellationToken ct)
    {
        var token = await useCase.Execute(request.Adapt<AuthenticateCourier>(), ct);
        return Ok(new { token });
    }
}
