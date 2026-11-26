using System.ComponentModel.DataAnnotations;

namespace ResultStudent.Api.Models;

public record LoginRequest([Required] string PhoneNumber, [Required] string Password);

public record LoginResponse(string Token, StudentProfileDto Student);

public record StudentProfileDto(
    int Id,
    string FirstName,
    string LastName,
    string FullName,
    string Initials,
    string PhoneNumber,
    string Branch,
    string Level,
    string Status,
    string Birthday,
    string? Instagram,
    string? Telegram,
    string? Location,
    int VerifiedCount,
    bool IsVerified
);

public record UpdateProfileRequest(
    [Required] string FirstName,
    [Required] string LastName,
    [Required] string PhoneNumber,
    [Required] string Birthday
);

public record UpdateVerificationRequest(
    string? Instagram,
    string? Telegram,
    string? Location
);

public record ChangePasswordRequest(
    [Required] string CurrentPassword,
    [Required, MinLength(6)] string NewPassword,
    [Required] string ConfirmPassword
);

public record BookLessonRequest(
    int? SlotId,
    [Required] int MentorId,
    [Required] string Date,
    [Required] string Time
);

public record CreateReferralRequest(
    [Required] string FirstName,
    [Required] string LastName,
    [Required] string BirthDate,
    [Required] string PhoneNumber
);

public record MakePaymentRequest(
    [Required] string Method,
    [Range(1000, 100000000)] long Amount,
    string? Description
);

public record PaymentSummaryDto(
    string StudentName,
    long CurrentBalance,
    long TotalDeposited,
    long TotalCharged,
    List<PaymentTransaction> Income,
    List<PaymentTransaction> Outcome,
    List<PaymentTransaction> Transfers
);
