using Microsoft.EntityFrameworkCore;
using ResultStudent.Api.Models;

namespace ResultStudent.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Student> Students => Set<Student>();
    public DbSet<Group> Groups => Set<Group>();
    public DbSet<ExamResult> ExamResults => Set<ExamResult>();
    public DbSet<SupportMentor> SupportMentors => Set<SupportMentor>();
    public DbSet<LessonSlot> LessonSlots => Set<LessonSlot>();
    public DbSet<PaymentTransaction> PaymentTransactions => Set<PaymentTransaction>();
    public DbSet<Referral> Referrals => Set<Referral>();
    public DbSet<NotificationItem> Notifications => Set<NotificationItem>();
    public DbSet<VocabularyWord> VocabularyWords => Set<VocabularyWord>();
}
