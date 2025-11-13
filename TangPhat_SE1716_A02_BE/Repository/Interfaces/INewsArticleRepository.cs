using BusinessObjects;

namespace Repository.Interfaces
{
    public interface INewsArticleRepository : IGenericRepository<NewsArticle>
    {
        Task<IEnumerable<NewsArticle>> GetAllWithDetailsAsync();
        Task<IEnumerable<NewsArticle>> GetActiveNewsAsync();
        Task<NewsArticle?> GetByIdWithDetailsAsync(int id);
        Task<IEnumerable<NewsArticle>> GetByCreatorAsync(int creatorId);
        Task<IEnumerable<NewsArticle>> SearchNewsAsync(string? searchTerm);
        Task<IEnumerable<NewsArticle>> GetNewsByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task UpdateNewsTagsAsync(int newsId, List<int> tagIds);
    }
}
