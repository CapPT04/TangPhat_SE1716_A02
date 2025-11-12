using System;
using System.Collections.Generic;

namespace BusinessObjects;

public partial class SystemAccount
{
    public int AccountId { get; set; }

    public string? AccountName { get; set; }

    public string AccountEmail { get; set; } = null!;

    public int AccountRole { get; set; }

    public string AccountPassword { get; set; } = null!;

    public bool IsActive { get; set; }

    public virtual ICollection<NewsArticle> NewsArticleCreatedBies { get; set; } = new List<NewsArticle>();

    public virtual ICollection<NewsArticle> NewsArticleUpdatedBies { get; set; } = new List<NewsArticle>();
}
