using BusinessObjects;
using BusinessObjects.DTOs;
using Repository.Interfaces;
using Service.Interfaces;

namespace Service.Implementations
{
    public class CategoryService : ICategoryService
    {
        private readonly IUnitOfWork _unitOfWork;

        public CategoryService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<CategoryResponse>> GetAllCategoriesAsync()
        {
            var categories = await _unitOfWork.Categories.SearchCategoriesAsync(null);
            return categories.Select(MapToResponse);
        }

        public async Task<IEnumerable<CategoryResponse>> GetActiveCategoriesAsync()
        {
            var categories = await _unitOfWork.Categories.GetActiveCategoriesAsync();
            return categories.Select(MapToResponse);
        }

        public async Task<CategoryResponse?> GetCategoryByIdAsync(int id)
        {
            var category = await _unitOfWork.Categories.GetByIdAsync(id);
            return category == null ? null : MapToResponse(category);
        }

        public async Task<IEnumerable<CategoryResponse>> SearchCategoriesAsync(string? searchTerm)
        {
            var categories = await _unitOfWork.Categories.SearchCategoriesAsync(searchTerm);
            return categories.Select(MapToResponse);
        }

        public async Task<CategoryResponse> CreateCategoryAsync(CategoryRequest request)
        {
            var category = new Category
            {
                CategoryName = request.CategoryName,
                CategoryDescription = request.CategoryDescription,
                ParentCategoryId = request.ParentCategoryId,
                IsActive = request.IsActive
            };

            await _unitOfWork.Categories.AddAsync(category);
            await _unitOfWork.SaveChangesAsync();
            
            return MapToResponse(category);
        }

        public async Task<CategoryResponse> UpdateCategoryAsync(int id, CategoryRequest request)
        {
            var category = await _unitOfWork.Categories.GetByIdAsync(id);
            if (category == null)
            {
                throw new KeyNotFoundException("Category not found.");
            }

            category.CategoryName = request.CategoryName;
            category.CategoryDescription = request.CategoryDescription;
            category.ParentCategoryId = request.ParentCategoryId;
            category.IsActive = request.IsActive;

            await _unitOfWork.Categories.UpdateAsync(category);
            await _unitOfWork.SaveChangesAsync();
            
            return MapToResponse(category);
        }

        public async Task<bool> DeleteCategoryAsync(int id)
        {
            var category = await _unitOfWork.Categories.GetByIdAsync(id);
            if (category == null)
            {
                return false;
            }

            // Check if category has any news articles
            var hasNews = await _unitOfWork.Categories.HasNewsArticlesAsync(id);
            if (hasNews)
            {
                throw new InvalidOperationException("Cannot delete category that contains news articles.");
            }

            await _unitOfWork.Categories.DeleteAsync(category);
            await _unitOfWork.SaveChangesAsync();
            
            return true;
        }

        private static CategoryResponse MapToResponse(Category category)
        {
            return new CategoryResponse
            {
                CategoryId = category.CategoryId,
                CategoryName = category.CategoryName,
                CategoryDescription = category.CategoryDescription,
                ParentCategoryId = category.ParentCategoryId,
                ParentCategoryName = category.ParentCategory?.CategoryName,
                IsActive = category.IsActive
            };
        }
    }
}
