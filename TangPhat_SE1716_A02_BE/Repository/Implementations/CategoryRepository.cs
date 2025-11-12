using BusinessObjects;
using Microsoft.EntityFrameworkCore;
using Repository.Interfaces;

namespace Repository.Implementations
{
    public class CategoryRepository : GenericRepository<Category>, ICategoryRepository
    {
        public CategoryRepository(FunewsManagementSystemContext context) : base(context)
        {
        }

        public async Task<bool> HasNewsArticlesAsync(int categoryId)
        {
            return await _context.NewsArticles.AnyAsync(n => n.CategoryId == categoryId);
        }

        public async Task<IEnumerable<Category>> SearchCategoriesAsync(string? searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
            {
                return await _dbSet.Include(c => c.ParentCategory).ToListAsync();
            }

            return await _dbSet
                .Include(c => c.ParentCategory)
                .Where(c => c.CategoryName.Contains(searchTerm) || 
                           (c.CategoryDescription != null && c.CategoryDescription.Contains(searchTerm)))
                .ToListAsync();
        }

        public async Task<IEnumerable<Category>> GetActiveCategoriesAsync()
        {
            return await _dbSet
                .Include(c => c.ParentCategory)
                .Where(c => c.IsActive)
                .ToListAsync();
        }
    }
}
