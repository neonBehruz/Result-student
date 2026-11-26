using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ResultStudent.Api.Data;
using ResultStudent.Api.Models;

namespace ResultStudent.Api.Controllers;

[Route("api")]
[Authorize]
public class FinanceController(AppDbContext db) : ApiControllerBase
{
    [HttpGet("payments")]
    public async Task<ActionResult<PaymentSummaryDto>> GetPayments()
    {
        var student = await db.Students.FindAsync(CurrentStudentId);
        if (student is null) return NotFound();

        var txns = await db.PaymentTransactions
            .Where(t => t.StudentId == CurrentStudentId)
            .OrderByDescending(t => t.Id)
            .ToListAsync();

        var income = txns.Where(t => t.Type == "Income").ToList();
        var outcome = txns.Where(t => t.Type == "Outcome").ToList();
        var transfers = txns.Where(t => t.Type == "Transfer").ToList();

        long deposited = income.Sum(t => t.Amount);
        long charged = outcome.Sum(t => t.Amount);

        return Ok(new PaymentSummaryDto(
            student.FullName.ToUpperInvariant(),
            deposited - charged,
            deposited,
            charged,
            income,
            outcome,
            transfers
        ));
    }

    [HttpPost("payments/pay")]
    public async Task<ActionResult<PaymentTransaction>> MakePayment([FromBody] MakePaymentRequest req)
    {
        var txn = new PaymentTransaction
        {
            StudentId = CurrentStudentId,
            Type = "Income",
            Method = req.Method.Trim().ToUpperInvariant(),
            Date = DateTime.Now.ToString("dd.MM.yyyy"),
            Amount = req.Amount,
            Currency = "UZS",
            Description = req.Description ?? "Online balance top-up"
        };

        db.PaymentTransactions.Add(txn);
        await db.SaveChangesAsync();
        return Ok(txn);
    }

    [HttpGet("referrals")]
    public async Task<ActionResult<List<Referral>>> GetReferrals()
    {
        var list = await db.Referrals
            .Where(r => r.StudentId == CurrentStudentId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
        return Ok(list);
    }

    [HttpPost("referrals")]
    public async Task<ActionResult<Referral>> CreateReferral([FromBody] CreateReferralRequest req)
    {
        var student = await db.Students.FindAsync(CurrentStudentId);
        if (student is null) return NotFound();

        var referral = new Referral
        {
            StudentId = CurrentStudentId,
            Branch = student.Branch,
            FirstName = req.FirstName.Trim(),
            LastName = req.LastName.Trim(),
            BirthDate = req.BirthDate.Trim(),
            PhoneNumber = req.PhoneNumber.Trim(),
            Status = "Pending"
        };

        db.Referrals.Add(referral);
        await db.SaveChangesAsync();
        return Ok(referral);
    }
}
