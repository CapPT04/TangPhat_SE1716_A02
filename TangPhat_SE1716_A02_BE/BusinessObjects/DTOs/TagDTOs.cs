using System.ComponentModel.DataAnnotations;

namespace BusinessObjects.DTOs
{
    public class TagRequest
    {
        [Required]
        [MaxLength(100)]
        public string TagName { get; set; } = null!;

        [MaxLength(255)]
        public string? Note { get; set; }
    }

    public class TagResponse
    {
        public int TagId { get; set; }
        public string TagName { get; set; } = null!;
        public string? Note { get; set; }
    }
}
