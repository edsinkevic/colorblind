using Domain.Commands.CourierCommands;
using Domain.UseCases.CourierUseCases;
using Microsoft.AspNetCore.Mvc;
using WebApp.Authorization;

namespace WebApp.Controllers;

[Authorize]
[ApiController]
[Route("admin")]
public class AdminController : ControllerBase
{
    [HttpGet("unapproved")]
    public async Task<IActionResult> Get(
        [FromServices] ListUnapprovedCouriersUseCase useCase,
        [FromQuery] string? name,
        [FromQuery] int? pageSize,
        [FromQuery] int? pageNum,
        CancellationToken ct) =>
        Ok(await useCase.Execute(pageNum, pageSize, name, ct));

    [HttpPost("{id:guid}/approve")]
    public async Task<IActionResult> Approve(
        [FromServices] ApproveCourierUseCase useCase,
        Guid id,
        CancellationToken ct,
        [FromHeader(Name = "If-Match")] string eTag)
    {
        var command = new ApproveCourier(id, eTag.ToExpectedVersion());
        await useCase.Execute(command, ct);
        return Ok();
    }
}
