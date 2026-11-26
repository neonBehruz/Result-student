using System.ComponentModel.DataAnnotations;

namespace ResultStudent.Api.Models;

public class Student
{
    public int Id { get; set; }
    [Required] public string FirstName { get; set; } = "Behruz";
    [Required] public string LastName { get; set; } = "Sagdullayev";
    [Required] public string PhoneNumber { get; set; } = "+998 (99) 191 93 77";
    [Required] public string PasswordHash { get; set; } = string.Empty;
    public string Branch { get; set; } = "Saxovat";
    public string Level { get; set; } = "N/A";
    public string Status { get; set; } = "Studying";
    public string Birthday { get; set; } = "02.07.2010";
    public string? Instagram { get; set; }
    public string? Telegram { get; set; }
    public string? Location { get; set; }
    public int MonthlyLessonLimit { get; set; } = 12;

    public string FullName => $"{FirstName} {LastName}";
    public string Initials => $"{FirstName.FirstOrDefault()}{LastName.FirstOrDefault()}".ToUpperInvariant();
}

public class Group
{
    public int Id { get; set; }
    [Required] public string Code { get; set; } = "IN";
    [Required] public string LevelName { get; set; } = "Intermediate";
    [Required] public string Title { get; set; } = string.Empty;
    [Required] public string ScheduleDays { get; set; } = "Mon,Wed,Fri";
    [Required] public string StartTime { get; set; } = "15:30";
    [Required] public string EndTime { get; set; } = "17:00";
    [Required] public string Classroom { get; set; } = "Classroom 7";
    [Required] public string TeacherName { get; set; } = "Otabekjon Abdullayev";
    [Required] public string TeacherInitials { get; set; } = "OA";
    [Required] public string Status { get; set; } = "Active"; // Active | Finished
}

public class ExamResult
{
    public int Id { get; set; }
    public int StudentId { get; set; }
    [Required] public string Level { get; set; } = string.Empty; // Inter, Pre
    [Required] public string ExamType { get; set; } = string.Empty; // Mid Term, Final
    [Required] public string Date { get; set; } = string.Empty; // 13.11.2026
    [Required] public string Time { get; set; } = "00:00";
    public int OverallScore { get; set; } = 70;
    public int ListeningScore { get; set; } = 72;
    public int ReadingScore { get; set; } = 70;
    public int WritingScore { get; set; } = 68;
    public int SpeakingScore { get; set; } = 70;
    public string TeacherComment { get; set; } = "Consistent progress across all modules.";
}

public class SupportMentor
{
    public int Id { get; set; }
    [Required] public string FullName { get; set; } = string.Empty;
    public string Specialty { get; set; } = "Academic Support";
    public string AvatarColor { get; set; } = "#C82B2B";
    public string PhotoUrl { get; set; } = string.Empty;
    public string AvailableDatesJson { get; set; } = "[]";
}

public class LessonSlot
{
    public int Id { get; set; }
    public int StudentId { get; set; }
    [Required] public string Status { get; set; } = "Expired"; // Expired | Available | Active | Confirmed | Missed | Late | Deducted
    [Required] public string Title { get; set; } = string.Empty;
    [Required] public string Subtitle { get; set; } = string.Empty;
    public string? PeriodLabel { get; set; }
    public int? MentorId { get; set; }
    public string? MentorName { get; set; }
    public string? BookedDate { get; set; } // yyyy-MM-dd
    public string? BookedTime { get; set; } // HH:mm
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class PaymentTransaction
{
    public int Id { get; set; }
    public int StudentId { get; set; }
    [Required] public string Type { get; set; } = "Income"; // Income | Outcome | Transfer
    [Required] public string Method { get; set; } = "CASH";
    [Required] public string Date { get; set; } = string.Empty;
    public long Amount { get; set; }
    public string Currency { get; set; } = "UZS";
    public string? Description { get; set; }
}

public class Referral
{
    public int Id { get; set; }
    public int StudentId { get; set; }
    [Required] public string Branch { get; set; } = "Saxovat";
    [Required] public string FirstName { get; set; } = string.Empty;
    [Required] public string LastName { get; set; } = string.Empty;
    [Required] public string BirthDate { get; set; } = string.Empty;
    [Required] public string PhoneNumber { get; set; } = string.Empty;
    public string Status { get; set; } = "Pending";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class NotificationItem
{
    public int Id { get; set; }
    public int StudentId { get; set; }
    [Required] public string Title { get; set; } = string.Empty;
    [Required] public string Message { get; set; } = string.Empty;
    [Required] public string CreatedAt { get; set; } = string.Empty;
    public bool IsRead { get; set; }
}

public class VocabularyWord
{
    public int Id { get; set; }
    [Required] public string Level { get; set; } = "Intermediate"; // Beginner | Elementary | Pre-Intermediate | Intermediate | Upper-Intermediate
    [Required] public string Unit { get; set; } = "Unit I";
    [Required] public string Word { get; set; } = string.Empty;
    [Required] public string PartOfSpeech { get; set; } = "noun"; // verb | adj | adv | noun | phr v | prep | pron | det
    public string Phonetic { get; set; } = string.Empty;
    [Required] public string Translation { get; set; } = string.Empty;
    public string Example { get; set; } = string.Empty;
}
