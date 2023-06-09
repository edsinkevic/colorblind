using Domain.Persistence;

using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Domain.Entities;
using Microsoft.Extensions.Configuration;

namespace Persistence.Implementation;

public class JwtUtils : IJwtUtils
{
    private readonly IConfiguration _configuration;

    public JwtUtils(
        IConfiguration configuration)
    {
        _configuration = configuration;

        if(string.IsNullOrEmpty(_configuration["Authentication:Schemes:JwtBearer:Key"]))
            throw new ApplicationException("Jwt Secret is not configured");
    }

    public string GenerateJwtToken(Courier courier)
    {
        // generate token that is valid for 15 minutes
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_configuration["Authentication:Schemes:JwtBearer:Key"]!);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[] { new Claim("id", courier.Id.ToString()) }),
            Expires = DateTime.UtcNow.AddMinutes(15),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    public Guid? ValidateJwtToken(string token)
    {
        if (token is null)
            return null;

        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_configuration["Authentication:Schemes:JwtBearer:Key"]!);
        try
        {
            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false,
                // set clockskew to zero so tokens expire exactly at token expiration time (instead of 5 minutes later)
                ClockSkew = TimeSpan.Zero
            }, out SecurityToken validatedToken);

            var jwtToken = (JwtSecurityToken)validatedToken;
            var courierId = Guid.Parse(jwtToken.Claims.First(x => x.Type == "id").Value);

            // return user id from JWT token if validation successful
            return courierId;
        }
        catch
        {
            // return null if validation fails
            return null;
        }
    }

    
}