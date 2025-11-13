using BusinessObjects.DTOs;

namespace Service.Interfaces
{
    public interface INewsArticleService
    {
        Task<IEnumerable<NewsArticleResponse>> GetAllNewsAsync();
        Task<IEnumerable<NewsArticleResponse>> GetActiveNewsAsync();
        Task<NewsArticleResponse?> GetNewsByIdAsync(int id);
        Task<IEnumerable<NewsArticleResponse>> SearchNewsAsync(string? searchTerm);
        Task<IEnumerable<NewsArticleResponse>> GetNewsByCreatorAsync(int creatorId);
        Task<IEnumerable<NewsArticleStatistic>> GetNewsStatisticsByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<NewsArticleResponse> CreateNewsAsync(NewsArticleRequest request, int creatorId);
        Task<NewsArticleResponse> UpdateNewsAsync(int id, NewsArticleUpdateRequest request, int updaterId);
        Task<bool> DeleteNewsAsync(int id);

        // Report methods - using existing DTOs
        Task<int> GetTotalArticlesCountAsync(DateTime? startDate = null, DateTime? endDate = null);
        Task<int> GetActiveArticlesCountAsync(DateTime? startDate = null, DateTime? endDate = null);
        Task<int> GetInactiveArticlesCountAsync(DateTime? startDate = null, DateTime? endDate = null);
        Task<int> GetTotalAuthorsCountAsync(DateTime? startDate = null, DateTime? endDate = null);
    }
}
