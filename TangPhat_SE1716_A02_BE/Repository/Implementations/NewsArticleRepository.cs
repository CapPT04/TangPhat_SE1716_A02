using BusinessObjects;
using Microsoft.EntityFrameworkCore;
using Repository.Interfaces;

namespace Repository.Implementations
{
    public class NewsArticleRepository : GenericRepository<NewsArticle>, INewsArticleRepository
    {
        public NewsArticleRepository(FunewsManagementSystemContext context) : base(context)
        {
        }

        public async Task<IEnumerable<NewsArticle>> GetActiveNewsAsync()
        {
            return await _dbSet
                .Include(n => n.Category)
                .Include(n => n.CreatedBy)
                .Include(n => n.UpdatedBy)
                .Include(n => n.Tags)
                .Where(n => n.NewsStatus)
                .OrderByDescending(n => n.CreatedDate)
                .ToListAsync();
        }

        public async Task<NewsArticle?> GetByIdWithDetailsAsync(int id)
        {
            return await _dbSet
                .Include(n => n.Category)
                .Include(n => n.CreatedBy)
                .Include(n => n.UpdatedBy)
                .Include(n => n.Tags)
                .FirstOrDefaultAsync(n => n.NewsArticleId == id);
        }

        public async Task<IEnumerable<NewsArticle>> GetByCreatorAsync(int creatorId)
        {
            return await _dbSet
                .Include(n => n.Category)
                .Include(n => n.CreatedBy)
                .Include(n => n.UpdatedBy)
                .Include(n => n.Tags)
                .Where(n => n.CreatedById == creatorId)
                .OrderByDescending(n => n.CreatedDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<NewsArticle>> SearchNewsAsync(string? searchTerm)
        {
            var query = _dbSet
                .Include(n => n.Category)
                .Include(n => n.CreatedBy)
                .Include(n => n.UpdatedBy)
                .Include(n => n.Tags)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                query = query.Where(n => n.NewsTitle.Contains(searchTerm) ||
                                        (n.Headline != null && n.Headline.Contains(searchTerm)) ||
                                        n.NewsContent.Contains(searchTerm));
            }

            return await query.OrderByDescending(n => n.CreatedDate).ToListAsync();
        }

        public async Task<IEnumerable<NewsArticle>> GetNewsByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await _dbSet
                .Include(n => n.Category)
                .Include(n => n.CreatedBy)
                .Include(n => n.UpdatedBy)
                .Include(n => n.Tags)
                .Where(n => n.CreatedDate >= startDate && n.CreatedDate <= endDate)
                .OrderByDescending(n => n.CreatedDate)
                .ToListAsync();
        }

        public async Task UpdateNewsTagsAsync(int newsId, List<int> tagIds)
        {
            var news = await _dbSet
                .Include(n => n.Tags)
                .FirstOrDefaultAsync(n => n.NewsArticleId == newsId);

            if (news == null) return;

            news.Tags.Clear();

            if (tagIds.Any())
            {
                var tags = await _context.Tags.Where(t => tagIds.Contains(t.TagId)).ToListAsync();
                foreach (var tag in tags)
                {
                    news.Tags.Add(tag);
                }
            }
        }
    }
}
