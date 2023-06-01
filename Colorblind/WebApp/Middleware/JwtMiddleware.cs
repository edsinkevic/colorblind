using Microsoft.AspNetCore.Http;
using Domain.Persistence;

namespace WebApp.Middleware;

public class JwtMiddleware
{
    private readonly RequestDelegate _next;

    public JwtMiddleware(RequestDelegate next, IConfiguration configuration)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context, ICourierRepository courierRepository, IJwtUtils jwtUtils)
    {
        var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
        var courierId = jwtUtils.ValidateJwtToken(token!);
        if (courierId != null)
        {
            // attach entity to context on successful jwt validation
            context.Items["Courier"] = await courierRepository.Get(courierId.Value);
        }

        await _next(context);
    }
}
