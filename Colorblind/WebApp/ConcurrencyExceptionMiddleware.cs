using System.Net;
using System.Text.Json;
using Domain.Errors;
using Marten.Exceptions;

namespace WebApp;

public class ConcurrencyExceptionMiddleware
{
    private readonly RequestDelegate _next;

    public ConcurrencyExceptionMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (ConcurrencyException ex)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.Conflict;
            await context.Response.WriteAsync(JsonSerializer.Serialize(new
            {
                title = "Conflict",
                status = context.Response.StatusCode,
                detail = ex.Message,
            }));
        }
    }
}
