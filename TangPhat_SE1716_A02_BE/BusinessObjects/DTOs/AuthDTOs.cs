using System.ComponentModel.DataAnnotations;

namespace BusinessObjects.DTOs
{
    public class LoginRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = null!;

        [Required]
        public string Password { get; set; } = null!;
    }

    public class LoginResponse
    {
        public int AccountId { get; set; }
        public string AccountName { get; set; } = null!;
        public string AccountEmail { get; set; } = null!;
        public int AccountRole { get; set; }
        public string Token { get; set; } = null!;
    }
}
