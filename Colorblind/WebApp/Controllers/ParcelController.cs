using Logic.Queries.GetParcel;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace WebApp.Controllers;

[ApiController]
[Route("parcels")]
public class ParcelController : ApiController
{
        private readonly IMediator _mediator;


        public ParcelController(IMediator mediator)
        {
                _mediator = mediator;
        }


        [HttpGet("{code}")]
        public async Task<IActionResult> Get(string code)
        {
                var query = new GetParcelQuery(code);
                var result = await _mediator.Send(query);

                return result.Match(value => Ok(new ParcelContract(value)), Problem);
        }
}
