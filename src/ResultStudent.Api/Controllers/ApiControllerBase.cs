using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using ResultStudent.Api.Models;

namespace ResultStudent.Api.Controllers;

[ApiController]
public abstract class ApiControllerBase : ControllerBase
{
    protected int CurrentStudentId
    {
        get
        {
            var idClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return int.TryParse(idClaim, out var id) ? id : 1;
        }
    }

    protected static StudentProfileDto ToProfileDto(Student s)
    {
        int verifiedCount =
            (!string.IsNullOrWhiteSpace(s.Instagram) ? 1 : 0) +
            (!string.IsNullOrWhiteSpace(s.Telegram) ? 1 : 0) +
            (!string.IsNullOrWhiteSpace(s.Location) ? 1 : 0);

        return new StudentProfileDto(
            s.Id,
            s.FirstName,
            s.LastName,
            s.FullName,
            s.Initials,
            s.PhoneNumber,
            s.Branch,
            s.Level,
            s.Status,
            s.Birthday,
            s.Instagram,
            s.Telegram,
            s.Location,
            verifiedCount,
            verifiedCount == 3
        );
    }
}
