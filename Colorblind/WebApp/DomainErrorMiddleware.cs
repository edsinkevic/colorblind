using System.Net;
using System.Text.Json;
using Domain.Errors;

namespace WebApp;

public class DomainErrorMiddleware
{
    private readonly RequestDelegate _next;

    public DomainErrorMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (DomainError ex)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            await context.Response.WriteAsync(JsonSerializer.Serialize(new
            {
                title = "Bad request", status = context.Response.StatusCode, detail = ex.Message,
            }));
        }
    }
}
