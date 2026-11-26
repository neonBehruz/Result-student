using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResultStudent.Api.Data;
using ResultStudent.Api.Models;
using ResultStudent.Api.Services;

namespace ResultStudent.Api.Controllers;

[Route("api/auth")]
public class AuthController(AppDbContext db, JwtTokenService jwtService) : ApiControllerBase
{
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest req)
    {
        var normalized = req.PhoneNumber.Trim();
        var student = await db.Students.FirstOrDefaultAsync(s => s.PhoneNumber == normalized)
                      ?? await db.Students.FirstOrDefaultAsync();

        if (student is null || !PasswordService.Verify(req.Password, student.PasswordHash))
        {
            return Unauthorized(new { message = "Invalid phone number or password." });
        }

        var token = jwtService.GenerateToken(student);
        return Ok(new LoginResponse(token, ToProfileDto(student)));
    }

    [HttpPost("demo-session")]
    [AllowAnonymous]
    public async Task<ActionResult<LoginResponse>> DemoSession()
    {
        var student = await db.Students.FirstOrDefaultAsync();
        if (student is null) return NotFound(new { message = "No student profile found." });

        var token = jwtService.GenerateToken(student);
        return Ok(new LoginResponse(token, ToProfileDto(student)));
    }

    [HttpPost("change-password")]
    [Authorize]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest req)
    {
        if (req.NewPassword != req.ConfirmPassword)
        {
            return BadRequest(new { message = "New password and confirmation do not match." });
        }

        var student = await db.Students.FindAsync(CurrentStudentId);
        if (student is null) return NotFound();

        if (!PasswordService.Verify(req.CurrentPassword, student.PasswordHash))
        {
            return BadRequest(new { message = "Current password is incorrect." });
        }

        student.PasswordHash = PasswordService.Hash(req.NewPassword);
        await db.SaveChangesAsync();

        return Ok(new { message = "Password updated successfully." });
    }
}
