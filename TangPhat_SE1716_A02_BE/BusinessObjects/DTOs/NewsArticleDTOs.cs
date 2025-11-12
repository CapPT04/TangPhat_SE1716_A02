using System.ComponentModel.DataAnnotations;

namespace BusinessObjects.DTOs
{
    public class NewsArticleRequest
    {
        [Required]
        [MaxLength(255)]
        public string NewsTitle { get; set; } = null!;

        [MaxLength(500)]
        public string? Headline { get; set; }

        [Required]
        public string NewsContent { get; set; } = null!;

        [MaxLength(255)]
        public string? NewsSource { get; set; }

        [Required]
        public int CategoryId { get; set; }

        public bool NewsStatus { get; set; } = true;

        public List<int> TagIds { get; set; } = new List<int>();
    }

    public class NewsArticleUpdateRequest
    {
        [Required]
        [MaxLength(255)]
        public string NewsTitle { get; set; } = null!;

        [MaxLength(500)]
        public string? Headline { get; set; }

        [Required]
        public string NewsContent { get; set; } = null!;

        [MaxLength(255)]
        public string? NewsSource { get; set; }

        [Required]
        public int CategoryId { get; set; }

        public bool NewsStatus { get; set; }

        public List<int> TagIds { get; set; } = new List<int>();
    }

    public class NewsArticleResponse
    {
        public int NewsArticleId { get; set; }
        public string NewsTitle { get; set; } = null!;
        public string? Headline { get; set; }
        public DateTime CreatedDate { get; set; }
        public string NewsContent { get; set; } = null!;
        public string? NewsSource { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = null!;
        public bool NewsStatus { get; set; }
        public int CreatedById { get; set; }
        public string CreatedByName { get; set; } = null!;
        public int? UpdatedById { get; set; }
        public string? UpdatedByName { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public List<TagResponse> Tags { get; set; } = new List<TagResponse>();
    }

    public class NewsArticleStatistic
    {
        public int NewsArticleId { get; set; }
        public string NewsTitle { get; set; } = null!;
        public DateTime CreatedDate { get; set; }
        public string CategoryName { get; set; } = null!;
        public string CreatedByName { get; set; } = null!;
        public bool NewsStatus { get; set; }
    }
}
