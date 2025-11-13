using BusinessObjects;
using BusinessObjects.DTOs;
using Repository.Interfaces;
using Service.Interfaces;

namespace Service.Implementations
{
    public class NewsArticleService : INewsArticleService
    {
        private readonly INewsArticleRepository _newsRepo;
        private readonly ITagRepository _tagRepo;

        public NewsArticleService(INewsArticleRepository newsRepo, ITagRepository tagRepo)
        {
            _newsRepo = newsRepo;
            _tagRepo = tagRepo;
        }

        public async Task<IEnumerable<NewsArticleResponse>> GetAllNewsAsync()
        {
            var news = await _newsRepo.GetAllWithDetailsAsync();
            return news.Select(MapToResponse);
        }

        public async Task<IEnumerable<NewsArticleResponse>> GetActiveNewsAsync()
        {
            var news = await _newsRepo.GetActiveNewsAsync();
            return news.Select(MapToResponse);
        }

        public async Task<NewsArticleResponse?> GetNewsByIdAsync(int id)
        {
            var news = await _newsRepo.GetByIdWithDetailsAsync(id);
            return news == null ? null : MapToResponse(news);
        }

        public async Task<IEnumerable<NewsArticleResponse>> SearchNewsAsync(string? searchTerm)
        {
            var news = await _newsRepo.SearchNewsAsync(searchTerm);
            return news.Select(MapToResponse);
        }

        public async Task<IEnumerable<NewsArticleResponse>> GetNewsByCreatorAsync(int creatorId)
        {
            var news = await _newsRepo.GetByCreatorAsync(creatorId);
            return news.Select(MapToResponse);
        }

        public async Task<IEnumerable<NewsArticleStatistic>> GetNewsStatisticsByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            var news = await _newsRepo.GetNewsByDateRangeAsync(startDate, endDate);

            return news.Select(n => new NewsArticleStatistic
            {
                NewsArticleId = n.NewsArticleId,
                NewsTitle = n.NewsTitle,
                CreatedDate = n.CreatedDate,
                CategoryName = n.Category.CategoryName,
                CreatedByName = n.CreatedBy.AccountName ?? n.CreatedBy.AccountEmail,
                NewsStatus = n.NewsStatus
            });
        }

        public async Task<NewsArticleResponse> CreateNewsAsync(NewsArticleRequest request, int creatorId)
        {
            var news = new NewsArticle
            {
                NewsTitle = request.NewsTitle,
                Headline = request.Headline,
                NewsContent = request.NewsContent,
                NewsSource = request.NewsSource,
                CategoryId = request.CategoryId,
                NewsStatus = request.NewsStatus,
                CreatedById = creatorId,
                CreatedDate = DateTime.Now
            };

            await _newsRepo.AddAsync(news);
            await _newsRepo.SaveChangesAsync();

            // Add tags if provided
            if (request.TagIds != null && request.TagIds.Any())
            {
                var tags = await _tagRepo.GetByIdsAsync(request.TagIds);
                news.Tags = tags.ToList();
                await _newsRepo.SaveChangesAsync();
            }

            // Reload with includes
            var createdNews = await _newsRepo.GetByIdWithDetailsAsync(news.NewsArticleId);

            return MapToResponse(createdNews!);
        }

        public async Task<NewsArticleResponse> UpdateNewsAsync(int id, NewsArticleUpdateRequest request, int updaterId)
        {
            var news = await _newsRepo.GetByIdWithDetailsAsync(id);

            if (news == null)
            {
                throw new KeyNotFoundException("News article not found.");
            }

            news.NewsTitle = request.NewsTitle;
            news.Headline = request.Headline;
            news.NewsContent = request.NewsContent;
            news.NewsSource = request.NewsSource;
            news.CategoryId = request.CategoryId;
            news.NewsStatus = request.NewsStatus;
            news.UpdatedById = updaterId;
            news.ModifiedDate = DateTime.Now;

            // Update tags
            news.Tags.Clear();
            if (request.TagIds != null && request.TagIds.Any())
            {
                var tags = await _tagRepo.GetByIdsAsync(request.TagIds);
                news.Tags = tags.ToList();
            }

            await _newsRepo.UpdateAsync(news);
            await _newsRepo.SaveChangesAsync();

            // Reload with all includes
            var updatedNews = await _newsRepo.GetByIdWithDetailsAsync(id);

            return MapToResponse(updatedNews!);
        }

        public async Task<bool> DeleteNewsAsync(int id)
        {
            // Get news entity for update (without includes to avoid tracking issues)
            var news = await _newsRepo.GetByIdAsync(id);
            if (news == null)
            {
                return false;
            }

            // Soft delete: Set status to inactive instead of deleting
            news.NewsStatus = false;
            news.ModifiedDate = DateTime.Now;
            
            // Update and save changes
            await _newsRepo.UpdateAsync(news);
            await _newsRepo.SaveChangesAsync();
            
            return true;
        }

        private static NewsArticleResponse MapToResponse(NewsArticle news)
        {
            return new NewsArticleResponse
            {
                NewsArticleId = news.NewsArticleId,
                NewsTitle = news.NewsTitle,
                Headline = news.Headline,
                CreatedDate = news.CreatedDate,
                NewsContent = news.NewsContent,
                NewsSource = news.NewsSource,
                CategoryId = news.CategoryId,
                CategoryName = news.Category.CategoryName,
                NewsStatus = news.NewsStatus,
                CreatedById = news.CreatedById,
                CreatedByName = news.CreatedBy.AccountName ?? news.CreatedBy.AccountEmail,
                UpdatedById = news.UpdatedById,
                UpdatedByName = news.UpdatedBy?.AccountName ?? news.UpdatedBy?.AccountEmail,
                ModifiedDate = news.ModifiedDate,
                Tags = news.Tags.Select(t => new TagResponse
                {
                    TagId = t.TagId,
                    TagName = t.TagName,
                    Note = t.Note
                }).ToList()
            };
        }

        // Report methods - simple count methods
        public async Task<int> GetTotalArticlesCountAsync(DateTime? startDate = null, DateTime? endDate = null)
        {
            var allNews = await _newsRepo.SearchNewsAsync(null);
            
            if (startDate.HasValue && endDate.HasValue)
            {
                // Set endDate to end of day (23:59:59) to include all articles created on that day
                var endOfDay = endDate.Value.Date.AddDays(1).AddTicks(-1);
                allNews = allNews.Where(n => n.CreatedDate >= startDate.Value && n.CreatedDate <= endOfDay);
            }

            return allNews.Count();
        }

        public async Task<int> GetActiveArticlesCountAsync(DateTime? startDate = null, DateTime? endDate = null)
        {
            var allNews = await _newsRepo.SearchNewsAsync(null);
            
            if (startDate.HasValue && endDate.HasValue)
            {
                // Set endDate to end of day (23:59:59) to include all articles created on that day
                var endOfDay = endDate.Value.Date.AddDays(1).AddTicks(-1);
                allNews = allNews.Where(n => n.CreatedDate >= startDate.Value && n.CreatedDate <= endOfDay);
            }

            return allNews.Count(n => n.NewsStatus);
        }

        public async Task<int> GetInactiveArticlesCountAsync(DateTime? startDate = null, DateTime? endDate = null)
        {
            var allNews = await _newsRepo.SearchNewsAsync(null);
            
            if (startDate.HasValue && endDate.HasValue)
            {
                // Set endDate to end of day (23:59:59) to include all articles created on that day
                var endOfDay = endDate.Value.Date.AddDays(1).AddTicks(-1);
                allNews = allNews.Where(n => n.CreatedDate >= startDate.Value && n.CreatedDate <= endOfDay);
            }

            return allNews.Count(n => !n.NewsStatus);
        }

        public async Task<int> GetTotalAuthorsCountAsync(DateTime? startDate = null, DateTime? endDate = null)
        {
            var allNews = await _newsRepo.SearchNewsAsync(null);
            
            if (startDate.HasValue && endDate.HasValue)
            {
                // Set endDate to end of day (23:59:59) to include all articles created on that day
                var endOfDay = endDate.Value.Date.AddDays(1).AddTicks(-1);
                allNews = allNews.Where(n => n.CreatedDate >= startDate.Value && n.CreatedDate <= endOfDay);
            }

            return allNews.Select(n => n.CreatedById).Distinct().Count();
        }
    }
}
