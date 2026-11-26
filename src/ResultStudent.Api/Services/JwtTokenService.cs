using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using ResultStudent.Api.Models;

namespace ResultStudent.Api.Services;

public class JwtTokenService(IConfiguration configuration)
{
    public string GenerateToken(Student student)
    {
        var key = configuration["Jwt:Key"] ?? "ResultStudentSuperSecretKeyForJwtAuthentication2026!";
        var issuer = configuration["Jwt:Issuer"] ?? "ResultStudent.Api";
        var audience = configuration["Jwt:Audience"] ?? "ResultStudent.Client";

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, student.Id.ToString()),
            new Claim(ClaimTypes.NameIdentifier, student.Id.ToString()),
            new Claim(ClaimTypes.Name, student.FullName),
            new Claim("phone", student.PhoneNumber)
        };

        var creds = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
            SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
