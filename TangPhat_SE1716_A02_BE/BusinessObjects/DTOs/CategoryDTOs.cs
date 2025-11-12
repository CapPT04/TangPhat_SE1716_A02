using System.ComponentModel.DataAnnotations;

namespace BusinessObjects.DTOs
{
    public class CategoryRequest
    {
        [Required]
        [MaxLength(150)]
        public string CategoryName { get; set; } = null!;

        [MaxLength(500)]
        public string? CategoryDescription { get; set; }

        public int? ParentCategoryId { get; set; }

        public bool IsActive { get; set; } = true;
    }

    public class CategoryResponse
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = null!;
        public string? CategoryDescription { get; set; }
        public int? ParentCategoryId { get; set; }
        public string? ParentCategoryName { get; set; }
        public bool IsActive { get; set; }
    }
}
