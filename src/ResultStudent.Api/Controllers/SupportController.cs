using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResultStudent.Api.Data;
using ResultStudent.Api.Models;

namespace ResultStudent.Api.Controllers;

[Route("api")]
[Authorize]
public class SupportController(AppDbContext db) : ApiControllerBase
{
    [HttpGet("supports")]
    public async Task<ActionResult<List<SupportMentor>>> GetSupports()
    {
        var mentors = await db.SupportMentors.OrderBy(m => m.Id).ToListAsync();
        return Ok(mentors);
    }

    [HttpGet("supports/{id:int}/availability")]
    public async Task<IActionResult> GetMentorAvailability(int id)
    {
        var mentor = await db.SupportMentors.FindAsync(id);
        if (mentor is null) return NotFound();

        var availableDates = JsonSerializer.Deserialize<string[]>(mentor.AvailableDatesJson) ?? [];
        var closedDates = new[] { "2026-11-25", "2026-11-26", "2026-11-29" };
        var timeSlots = new[] { "10:00", "11:30", "14:00", "15:30", "17:00" };

        return Ok(new
        {
            mentor,
            availableDates,
            closedDates,
            timeSlots
        });
    }

    [HttpGet("lessons")]
    public async Task<ActionResult<List<LessonSlot>>> GetLessons([FromQuery] string? filter = null)
    {
        var query = db.LessonSlots.Where(l => l.StudentId == CurrentStudentId);

        if (string.Equals(filter, "active", StringComparison.OrdinalIgnoreCase))
        {
            query = query.Where(l => l.Status == "Active" || l.Status == "Available");
        }
        else if (string.Equals(filter, "history", StringComparison.OrdinalIgnoreCase))
        {
            query = query.Where(l => l.Status != "Available");
        }

        var list = await query.OrderBy(l => l.Id).ToListAsync();
        return Ok(list);
    }

    [HttpPost("lessons/book")]
    public async Task<ActionResult<LessonSlot>> BookLesson([FromBody] BookLessonRequest req)
    {
        var mentor = await db.SupportMentors.FindAsync(req.MentorId);
        if (mentor is null) return NotFound(new { message = "Mentor not found." });

        LessonSlot? slot = null;
        if (req.SlotId.HasValue)
        {
            slot = await db.LessonSlots.FirstOrDefaultAsync(l => l.Id == req.SlotId.Value && l.StudentId == CurrentStudentId && l.Status == "Available");
        }
        slot ??= await db.LessonSlots.FirstOrDefaultAsync(l => l.StudentId == CurrentStudentId && l.Status == "Available");

        if (slot is null)
        {
            return BadRequest(new { message = "No available booking slots remaining." });
        }

        slot.Status = "Active";
        slot.MentorId = mentor.Id;
        slot.MentorName = mentor.FullName;
        slot.BookedDate = req.Date;
        slot.BookedTime = req.Time;
        slot.Title = $"{mentor.FullName} · {req.Date}";
        slot.Subtitle = $"Scheduled at {req.Time} · Academic Support";

        await db.SaveChangesAsync();
        return Ok(slot);
    }

    [HttpDelete("lessons/{id:int}")]
    public async Task<ActionResult<LessonSlot>> CancelLesson(int id)
    {
        var slot = await db.LessonSlots.FirstOrDefaultAsync(l => l.Id == id && l.StudentId == CurrentStudentId);
        if (slot is null) return NotFound();
        if (slot.Status != "Active") return BadRequest(new { message = "Only active lessons can be cancelled." });

        slot.Status = "Available";
        slot.MentorId = null;
        slot.MentorName = null;
        slot.BookedDate = null;
        slot.BookedTime = null;
        slot.Title = "Book a lesson · Nov 23–29";
        slot.Subtitle = "You can book a lesson for this slot.";

        await db.SaveChangesAsync();
        return Ok(slot);
    }
}
