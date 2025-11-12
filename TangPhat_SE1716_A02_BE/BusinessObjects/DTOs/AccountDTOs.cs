using System.ComponentModel.DataAnnotations;

namespace BusinessObjects.DTOs
{
    public class AccountRequest
    {
        [Required]
        [MaxLength(100)]
        public string AccountName { get; set; } = null!;

        [Required]
        [EmailAddress]
        [MaxLength(255)]
        public string AccountEmail { get; set; } = null!;

        [Required]
        public int AccountRole { get; set; }

        [Required]
        [MinLength(6)]
        [MaxLength(255)]
        public string AccountPassword { get; set; } = null!;

        public bool IsActive { get; set; } = true;
    }

    public class AccountUpdateRequest
    {
        [Required]
        [MaxLength(100)]
        public string AccountName { get; set; } = null!;

        [Required]
        public int AccountRole { get; set; }

        [MinLength(6)]
        [MaxLength(255)]
        public string? AccountPassword { get; set; }

        public bool IsActive { get; set; }
    }

    public class AccountResponse
    {
        public int AccountId { get; set; }
        public string? AccountName { get; set; }
        public string AccountEmail { get; set; } = null!;
        public int AccountRole { get; set; }
        public bool IsActive { get; set; }
    }

    public class ProfileUpdateRequest
    {
        [Required]
        [MaxLength(100)]
        public string AccountName { get; set; } = null!;

        [MinLength(6)]
        [MaxLength(255)]
        public string? AccountPassword { get; set; }
    }
}
