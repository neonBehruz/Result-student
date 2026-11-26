using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResultStudent.Api.Data;
using ResultStudent.Api.Models;

namespace ResultStudent.Api.Controllers;

[Route("api/profile")]
[Authorize]
public class ProfileController(AppDbContext db) : ApiControllerBase
{
    [HttpGet]
    public async Task<ActionResult<StudentProfileDto>> GetProfile()
    {
        var student = await db.Students.FindAsync(CurrentStudentId);
        if (student is null) return NotFound();
        return Ok(ToProfileDto(student));
    }

    [HttpPut]
    public async Task<ActionResult<StudentProfileDto>> UpdateProfile([FromBody] UpdateProfileRequest req)
    {
        var student = await db.Students.FindAsync(CurrentStudentId);
        if (student is null) return NotFound();

        student.FirstName = req.FirstName.Trim();
        student.LastName = req.LastName.Trim();
        student.PhoneNumber = req.PhoneNumber.Trim();
        student.Birthday = req.Birthday.Trim();

        await db.SaveChangesAsync();
        return Ok(ToProfileDto(student));
    }

    [HttpPut("verification")]
    public async Task<ActionResult<StudentProfileDto>> UpdateVerification([FromBody] UpdateVerificationRequest req)
    {
        var student = await db.Students.FindAsync(CurrentStudentId);
        if (student is null) return NotFound();

        if (req.Instagram is not null) student.Instagram = string.IsNullOrWhiteSpace(req.Instagram) ? null : req.Instagram.Trim();
        if (req.Telegram is not null) student.Telegram = string.IsNullOrWhiteSpace(req.Telegram) ? null : req.Telegram.Trim();
        if (req.Location is not null) student.Location = string.IsNullOrWhiteSpace(req.Location) ? null : req.Location.Trim();

        await db.SaveChangesAsync();
        return Ok(ToProfileDto(student));
    }

    [HttpGet("notifications")]
    public async Task<ActionResult<List<NotificationItem>>> GetNotifications()
    {
        var items = await db.Notifications
            .Where(n => n.StudentId == CurrentStudentId)
            .OrderByDescending(n => n.Id)
            .ToListAsync();
        return Ok(items);
    }

    [HttpPost("notifications/read-all")]
    public async Task<IActionResult> MarkAllRead()
    {
        var items = await db.Notifications.Where(n => n.StudentId == CurrentStudentId && !n.IsRead).ToListAsync();
        foreach (var item in items) item.IsRead = true;
        await db.SaveChangesAsync();
        return Ok();
    }
}
