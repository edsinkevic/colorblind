using Domain.Entities;
using Domain.Errors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace WebApp.Authorization;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class AuthorizeAttribute : Attribute, IAuthorizationFilter
{
    public void OnAuthorization(AuthorizationFilterContext context)
    {
        // skip authorization if action is decorated with [AllowAnonymous] attribute
        var allowAnonymous = context.ActionDescriptor.EndpointMetadata.OfType<AllowAnonymousAttribute>().Any();
        if (allowAnonymous)
            return;

        // authorization
        var courier = (Courier?)context.HttpContext.Items["Courier"];
        if (courier == null)
            throw new DomainUnauthorizedError("Session missing.");
        
        if (!courier.IsApproved)
            throw new DomainUnauthorizedError("You were not approved yet by an administrator.");
    }
}
