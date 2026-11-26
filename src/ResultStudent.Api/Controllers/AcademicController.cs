using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResultStudent.Api.Data;
using ResultStudent.Api.Models;

namespace ResultStudent.Api.Controllers;

[Route("api")]
[Authorize]
public class AcademicController(AppDbContext db) : ApiControllerBase
{
    [HttpGet("exams")]
    public async Task<ActionResult<List<ExamResult>>> GetExams()
    {
        var exams = await db.ExamResults
            .Where(e => e.StudentId == CurrentStudentId)
            .OrderBy(e => e.Id)
            .ToListAsync();
        return Ok(exams);
    }

    [HttpGet("groups")]
    public async Task<ActionResult<List<Group>>> GetGroups([FromQuery] string status = "Active")
    {
        var groups = await db.Groups
            .Where(g => g.Status.ToLower() == status.ToLower())
            .OrderBy(g => g.Id)
            .ToListAsync();
        return Ok(groups);
    }

    [HttpGet("resources/books")]
    public IActionResult GetBooks() => Ok(Array.Empty<object>());

    [HttpGet("resources/podcasts")]
    public IActionResult GetPodcasts() => Ok(Array.Empty<object>());

    [HttpGet("resources/vocabulary")]
    public async Task<IActionResult> GetVocabulary([FromQuery] string? level = null, [FromQuery] string? unit = null, [FromQuery] string? pos = null)
    {
        var query = db.VocabularyWords.AsQueryable();

        if (!string.IsNullOrWhiteSpace(level))
        {
            query = query.Where(w => w.Level.ToLower() == level.ToLower());
        }
        if (!string.IsNullOrWhiteSpace(unit))
        {
            query = query.Where(w => w.Unit.ToLower() == unit.ToLower());
        }
        if (!string.IsNullOrWhiteSpace(pos) && !pos.Equals("all", StringComparison.OrdinalIgnoreCase))
        {
            var p = pos.ToLower();
            if (p == "verb")
                query = query.Where(w => w.PartOfSpeech.ToLower() == "verb" || w.PartOfSpeech.ToLower() == "phr v");
            else
                query = query.Where(w => w.PartOfSpeech.ToLower() == p);
        }

        var words = await query.OrderBy(w => w.Id).ToListAsync();
        return Ok(words);
    }

    [HttpGet("resources/vocabulary/units")]
    public async Task<IActionResult> GetVocabularyUnits([FromQuery] string level = "Intermediate")
    {
        var units = await db.VocabularyWords
            .Where(w => w.Level.ToLower() == level.ToLower())
            .GroupBy(w => w.Unit)
            .Select(g => new { unit = g.Key, count = g.Count(), minId = g.Min(x => x.Id) })
            .OrderBy(x => x.minId)
            .ToListAsync();
        return Ok(units);
    }

    [HttpGet("resources/vocabulary/counts")]
    public async Task<IActionResult> GetVocabularyCounts()
    {
        var counts = await db.VocabularyWords
            .GroupBy(w => w.Level)
            .Select(g => new { level = g.Key, count = g.Count() })
            .ToListAsync();
        return Ok(counts);
    }

    [HttpPost("resources/vocabulary")]
    public async Task<IActionResult> AddVocabularyWords([FromBody] List<VocabularyWord> words)
    {
        if (words is null || words.Count == 0)
            return BadRequest(new { message = "No words provided." });

        db.VocabularyWords.AddRange(words);
        await db.SaveChangesAsync();
        return Ok(new { added = words.Count });
    }
}
