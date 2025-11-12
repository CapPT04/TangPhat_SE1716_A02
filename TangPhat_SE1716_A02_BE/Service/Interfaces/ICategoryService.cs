using BusinessObjects.DTOs;

namespace Service.Interfaces
{
    public interface ICategoryService
    {
        Task<IEnumerable<CategoryResponse>> GetAllCategoriesAsync();
        Task<IEnumerable<CategoryResponse>> GetActiveCategoriesAsync();
        Task<CategoryResponse?> GetCategoryByIdAsync(int id);
        Task<IEnumerable<CategoryResponse>> SearchCategoriesAsync(string? searchTerm);
        Task<CategoryResponse> CreateCategoryAsync(CategoryRequest request);
        Task<CategoryResponse> UpdateCategoryAsync(int id, CategoryRequest request);
        Task<bool> DeleteCategoryAsync(int id);
    }
}
