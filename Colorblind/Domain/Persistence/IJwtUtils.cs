namespace Domain.Persistence;

using Domain.Entities;

public interface IJwtUtils
{
    public string GenerateJwtToken(Courier courier);
    public Guid? ValidateJwtToken(string token);
}