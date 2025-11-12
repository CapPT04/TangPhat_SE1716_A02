using BusinessObjects;
using BusinessObjects.DTOs;
using Repository.Interfaces;
using Service.Interfaces;

namespace Service.Implementations
{
    public class NewsArticleService : INewsArticleService
    {
        private readonly IUnitOfWork _unitOfWork;

        public NewsArticleService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<NewsArticleResponse>> GetAllNewsAsync()
        {
            var news = await _unitOfWork.NewsArticles.SearchNewsAsync(null);
            return news.Select(MapToResponse);
        }

        public async Task<IEnumerable<NewsArticleResponse>> GetActiveNewsAsync()
        {
            var news = await _unitOfWork.NewsArticles.GetActiveNewsAsync();
            return news.Select(MapToResponse);
        }

        public async Task<NewsArticleResponse?> GetNewsByIdAsync(int id)
        {
            var news = await _unitOfWork.NewsArticles.GetByIdWithDetailsAsync(id);
            return news == null ? null : MapToResponse(news);
        }

        public async Task<IEnumerable<NewsArticleResponse>> SearchNewsAsync(string? searchTerm)
        {
            var news = await _unitOfWork.NewsArticles.SearchNewsAsync(searchTerm);
            return news.Select(MapToResponse);
        }

        public async Task<IEnumerable<NewsArticleResponse>> GetNewsByCreatorAsync(int creatorId)
        {
            var news = await _unitOfWork.NewsArticles.GetByCreatorAsync(creatorId);
            return news.Select(MapToResponse);
        }

        public async Task<IEnumerable<NewsArticleStatistic>> GetNewsStatisticsByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            var news = await _unitOfWork.NewsArticles.GetNewsByDateRangeAsync(startDate, endDate);
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

            await _unitOfWork.NewsArticles.AddAsync(news);
            await _unitOfWork.SaveChangesAsync();

            if (request.TagIds.Any())
            {
                await _unitOfWork.NewsArticles.UpdateNewsTagsAsync(news.NewsArticleId, request.TagIds);
                await _unitOfWork.SaveChangesAsync();
            }

            var createdNews = await _unitOfWork.NewsArticles.GetByIdWithDetailsAsync(news.NewsArticleId);
            return MapToResponse(createdNews!);
        }

        public async Task<NewsArticleResponse> UpdateNewsAsync(int id, NewsArticleUpdateRequest request, int updaterId)
        {
            var news = await _unitOfWork.NewsArticles.GetByIdAsync(id);
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

            await _unitOfWork.NewsArticles.UpdateAsync(news);
            await _unitOfWork.NewsArticles.UpdateNewsTagsAsync(id, request.TagIds);
            await _unitOfWork.SaveChangesAsync();

            var updatedNews = await _unitOfWork.NewsArticles.GetByIdWithDetailsAsync(id);
            return MapToResponse(updatedNews!);
        }

        public async Task<bool> DeleteNewsAsync(int id)
        {
            var news = await _unitOfWork.NewsArticles.GetByIdAsync(id);
            if (news == null)
            {
                return false;
            }

            await _unitOfWork.NewsArticles.DeleteAsync(news);
            await _unitOfWork.SaveChangesAsync();
            
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
            var allNews = await _unitOfWork.NewsArticles.SearchNewsAsync(null);
            
            if (startDate.HasValue && endDate.HasValue)
            {
                allNews = allNews.Where(n => n.CreatedDate >= startDate.Value && n.CreatedDate <= endDate.Value);
            }

            return allNews.Count();
        }

        public async Task<int> GetPublishedArticlesCountAsync(DateTime? startDate = null, DateTime? endDate = null)
        {
            var allNews = await _unitOfWork.NewsArticles.SearchNewsAsync(null);
            
            if (startDate.HasValue && endDate.HasValue)
            {
                allNews = allNews.Where(n => n.CreatedDate >= startDate.Value && n.CreatedDate <= endDate.Value);
            }

            return allNews.Count(n => n.NewsStatus);
        }

        public async Task<int> GetDraftArticlesCountAsync(DateTime? startDate = null, DateTime? endDate = null)
        {
            var allNews = await _unitOfWork.NewsArticles.SearchNewsAsync(null);
            
            if (startDate.HasValue && endDate.HasValue)
            {
                allNews = allNews.Where(n => n.CreatedDate >= startDate.Value && n.CreatedDate <= endDate.Value);
            }

            return allNews.Count(n => !n.NewsStatus);
        }

        public async Task<int> GetTotalAuthorsCountAsync(DateTime? startDate = null, DateTime? endDate = null)
        {
            var allNews = await _unitOfWork.NewsArticles.SearchNewsAsync(null);
            
            if (startDate.HasValue && endDate.HasValue)
            {
                allNews = allNews.Where(n => n.CreatedDate >= startDate.Value && n.CreatedDate <= endDate.Value);
            }

            return allNews.Select(n => n.CreatedById).Distinct().Count();
        }
    }
}
