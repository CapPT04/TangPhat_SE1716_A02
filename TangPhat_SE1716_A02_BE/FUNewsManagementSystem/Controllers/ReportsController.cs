using BusinessObjects.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.Interfaces;

namespace FUNewsManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "3")] // Admin only (role = 3)
    public class ReportsController : ControllerBase
    {
        private readonly INewsArticleService _newsService;
        private readonly ICategoryService _categoryService;
        private readonly ITagService _tagService;
        private readonly IAccountService _accountService;

        public ReportsController(
            INewsArticleService newsService,
            ICategoryService categoryService,
            ITagService tagService,
            IAccountService accountService)
        {
            _newsService = newsService;
            _categoryService = categoryService;
            _tagService = tagService;
            _accountService = accountService;
        }

        /// <summary>
        /// Get news statistics by date range - reusing existing DTOs
        /// </summary>
        [HttpGet("statistics")]
        public async Task<ActionResult<ApiResponse<IEnumerable<NewsArticleStatistic>>>> GetStatistics(
            [FromQuery] DateTime startDate,
            [FromQuery] DateTime endDate)
        {
            if (startDate > endDate)
            {
                return BadRequest(ApiResponse<IEnumerable<NewsArticleStatistic>>.Fail("Start date must be before end date.", 400));
            }

            var statistics = await _newsService.GetNewsStatisticsByDateRangeAsync(startDate, endDate);
            return Ok(ApiResponse<IEnumerable<NewsArticleStatistic>>.Succeed(statistics, "Statistics retrieved successfully.", 200));
        }

        /// <summary>
        /// Get total counts for dashboard
        /// </summary>
        [HttpGet("counts")]
        public async Task<ActionResult<ApiResponse<object>>> GetCounts(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null)
        {
            if (startDate.HasValue && endDate.HasValue && startDate > endDate)
            {
                return BadRequest(ApiResponse<object>.Fail("Start date must be before end date.", 400));
            }

            var totalArticles = await _newsService.GetTotalArticlesCountAsync(startDate, endDate);
            var publishedArticles = await _newsService.GetPublishedArticlesCountAsync(startDate, endDate);
            var draftArticles = await _newsService.GetDraftArticlesCountAsync(startDate, endDate);
            var totalAuthors = await _newsService.GetTotalAuthorsCountAsync(startDate, endDate);

            var allAccounts = await _accountService.GetAllAccountsAsync();
            var totalUsers = allAccounts.Count();

            var allCategories = await _categoryService.GetAllCategoriesAsync();
            var totalCategories = allCategories.Count();

            var allTags = await _tagService.GetAllTagsAsync();
            var totalTags = allTags.Count();

            var result = new
            {
                totalArticles,
                publishedArticles,
                draftArticles,
                totalAuthors,
                totalUsers,
                totalCategories,
                totalTags
            };

            return Ok(ApiResponse<object>.Succeed(result, "Counts retrieved successfully.", 200));
        }

        /// <summary>
        /// Get all news articles with details
        /// </summary>
        [HttpGet("all-news")]
        public async Task<ActionResult<ApiResponse<IEnumerable<NewsArticleResponse>>>> GetAllNews()
        {
            var news = await _newsService.GetAllNewsAsync();
            return Ok(ApiResponse<IEnumerable<NewsArticleResponse>>.Succeed(news, "All news retrieved successfully.", 200));
        }

        /// <summary>
        /// Get all categories with article counts
        /// </summary>
        [HttpGet("all-categories")]
        public async Task<ActionResult<ApiResponse<IEnumerable<CategoryResponse>>>> GetAllCategories()
        {
            var categories = await _categoryService.GetAllCategoriesAsync();
            return Ok(ApiResponse<IEnumerable<CategoryResponse>>.Succeed(categories, "All categories retrieved successfully.", 200));
        }

        /// <summary>
        /// Get all tags
        /// </summary>
        [HttpGet("all-tags")]
        public async Task<ActionResult<ApiResponse<IEnumerable<TagResponse>>>> GetAllTags()
        {
            var tags = await _tagService.GetAllTagsAsync();
            return Ok(ApiResponse<IEnumerable<TagResponse>>.Succeed(tags, "All tags retrieved successfully.", 200));
        }

        /// <summary>
        /// Get all accounts
        /// </summary>
        [HttpGet("all-accounts")]
        public async Task<ActionResult<ApiResponse<IEnumerable<AccountResponse>>>> GetAllAccounts()
        {
            var accounts = await _accountService.GetAllAccountsAsync();
            return Ok(ApiResponse<IEnumerable<AccountResponse>>.Succeed(accounts, "All accounts retrieved successfully.", 200));
        }
    }
}
