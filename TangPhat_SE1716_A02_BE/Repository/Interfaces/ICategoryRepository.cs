using BusinessObjects;

namespace Repository.Interfaces
{
    public interface ICategoryRepository : IGenericRepository<Category>
    {
        Task<bool> HasNewsArticlesAsync(int categoryId);
        Task<IEnumerable<Category>> SearchCategoriesAsync(string? searchTerm);
        Task<IEnumerable<Category>> GetActiveCategoriesAsync();
    }
}
