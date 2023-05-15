using Domain.Commands.CourierCommands;
using Domain.UseCases.CourierUseCases;
using Mapster;
using Microsoft.AspNetCore.Mvc;
using WebApp.Requests;

namespace WebApp.Controllers;

[ApiController]
[Route("couriers")]
public class CourierController : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get(
        [FromServices] ListCouriersUseCase useCase,
        [FromQuery] string? name,
        [FromQuery] int? pageSize,
        [FromQuery] int? pageNum,
        CancellationToken ct) =>
        Ok(await useCase.Execute(pageNum, pageSize, name, ct));


    [HttpGet("{id:guid}")]
    public async Task<IActionResult> Get([FromServices] GetCourierUseCase useCase, Guid id, CancellationToken ct)
    {
        var courier = await useCase.Execute(id, ct);

        return courier is null
            ? Problem(statusCode: StatusCodes.Status404NotFound, title: "Not found")
            : Ok(courier);
    }

    [HttpPost]
    public async Task<ActionResult> Post([FromServices] RegisterCourierUseCase useCase,
        RegisterCourierRequest request,
        CancellationToken ct)
    {
        var command = request.Adapt<RegisterCourier>();
        var id = await useCase.Execute(command, ct);
        return Ok(new { id });
    }
}
