using BusinessObjects.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.Interfaces;

namespace FUNewsManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoriesController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        /// <summary>
        /// Get all categories (Staff only)
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<ApiResponse<IEnumerable<CategoryResponse>>>> GetAll()
        {
            var categories = await _categoryService.GetAllCategoriesAsync();
            return Ok(ApiResponse<IEnumerable<CategoryResponse>>.Succeed(categories));
        }

        /// <summary>
        /// Get active categories (Staff only)
        /// </summary>
        [HttpGet("active")]
        // [Authorize(Roles = "1")]
        public async Task<ActionResult<ApiResponse<IEnumerable<CategoryResponse>>>> GetActive()
        {
            var categories = await _categoryService.GetActiveCategoriesAsync();
            return Ok(ApiResponse<IEnumerable<CategoryResponse>>.Succeed(categories));
        }

        /// <summary>
        /// Get category by ID (Staff only)
        /// </summary>
        [HttpGet("{id}")]
        [Authorize(Roles = "1")]
        public async Task<ActionResult<ApiResponse<CategoryResponse>>> GetById(int id)
        {
            var category = await _categoryService.GetCategoryByIdAsync(id);
            if (category == null)
            {
                return NotFound(ApiResponse<CategoryResponse>.Fail("Category not found."));
            }
            return Ok(ApiResponse<CategoryResponse>.Succeed(category));
        }

        /// <summary>
        /// Search categories (Staff only)
        /// </summary>
        [HttpGet("search")]
        [Authorize(Roles = "1")]
        public async Task<ActionResult<ApiResponse<IEnumerable<CategoryResponse>>>> Search([FromQuery] string? searchTerm)
        {
            var categories = await _categoryService.SearchCategoriesAsync(searchTerm);
            return Ok(ApiResponse<IEnumerable<CategoryResponse>>.Succeed(categories));
        }

        /// <summary>
        /// Create new category (Staff only)
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "1")]
        public async Task<ActionResult<ApiResponse<CategoryResponse>>> Create([FromBody] CategoryRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<CategoryResponse>.Fail("Invalid input."));
            }

            var category = await _categoryService.CreateCategoryAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = category.CategoryId }, 
                ApiResponse<CategoryResponse>.Succeed(category, "Category created successfully."));
        }

        /// <summary>
        /// Update category (Staff only)
        /// </summary>
        [HttpPut("{id}")]
        [Authorize(Roles = "1")]
        public async Task<ActionResult<ApiResponse<CategoryResponse>>> Update(int id, [FromBody] CategoryRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<CategoryResponse>.Fail("Invalid input."));
            }

            try
            {
                var category = await _categoryService.UpdateCategoryAsync(id, request);
                return Ok(ApiResponse<CategoryResponse>.Succeed(category, "Category updated successfully."));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ApiResponse<CategoryResponse>.Fail(ex.Message));
            }
        }

        /// <summary>
        /// Delete category (Staff only)
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "1")]
        public async Task<ActionResult<ApiResponse<object>>> Delete(int id)
        {
            try
            {
                var result = await _categoryService.DeleteCategoryAsync(id);
                if (!result)
                {
                    return NotFound(ApiResponse<object>.Fail("Category not found."));
                }
                return Ok(ApiResponse<object>.Succeed(null, "Category deleted successfully."));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ApiResponse<object>.Fail(ex.Message));
            }
        }

        /// <summary>
        /// Get total categories count (Admin only - for reports)
        /// </summary>
        [HttpGet("count")]
        [Authorize(Roles = "3")]
        public async Task<ActionResult<ApiResponse<int>>> GetCount()
        {
            var categories = await _categoryService.GetAllCategoriesAsync();
            return Ok(ApiResponse<int>.Succeed(categories.Count(), "Count retrieved successfully."));
        }
    }
}
