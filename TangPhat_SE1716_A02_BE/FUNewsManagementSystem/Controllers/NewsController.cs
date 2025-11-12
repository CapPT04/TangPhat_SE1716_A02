using BusinessObjects.DTOs;
using FUNewsManagementSystem.Constants;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.Interfaces;
using System.Security.Claims;

namespace FUNewsManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "1,2,3")] 
    public class NewsController : ControllerBase
    {
        private readonly INewsArticleService _newsService;

        public NewsController(INewsArticleService newsService)
        {
            _newsService = newsService;
        }

        /// <summary>
        /// Get active news articles (Staff and Lecturer)
        /// </summary>
        [HttpGet("active")]
        [Authorize(Roles = "1,2")]
        public async Task<ActionResult<ApiResponse<IEnumerable<NewsArticleResponse>>>> GetActiveNews()
        {
            var news = await _newsService.GetActiveNewsAsync();
            return Ok(ApiResponse<IEnumerable<NewsArticleResponse>>.Succeed(news, "Get active news successfully.", 200));
        }

        /// <summary>
        /// Get news article by ID (Staff and Lecturer)
        /// </summary>
        [HttpGet("{id}")]
        [Authorize(Roles = "1,2")]
        public async Task<ActionResult<ApiResponse<NewsArticleResponse>>> GetById(int id)
        {
            var news = await _newsService.GetNewsByIdAsync(id);
            if (news == null)
            {
                return NotFound(ApiResponse<NewsArticleResponse>.Fail("News article not found.", 404));
            }
            return Ok(ApiResponse<NewsArticleResponse>.Succeed(news, "Get news successfully.", 200));
        }

        /// <summary>
        /// Get all news articles (Staff)
        /// </summary>
        [HttpGet]
        [Authorize(Roles = "1")]
        public async Task<ActionResult<ApiResponse<IEnumerable<NewsArticleResponse>>>> GetAll()
        {
            var news = await _newsService.GetAllNewsAsync();
            return Ok(ApiResponse<IEnumerable<NewsArticleResponse>>.Succeed(news, "Get all news successfully.", 200));
        }

        /// <summary>
        /// Search news articles (Staff and Lecturer)
        /// </summary>
        [HttpGet("search")]
        [Authorize(Roles = "1,2")]
        public async Task<ActionResult<ApiResponse<IEnumerable<NewsArticleResponse>>>> Search([FromQuery] string? searchTerm)
        {
            var news = await _newsService.SearchNewsAsync(searchTerm);
            return Ok(ApiResponse<IEnumerable<NewsArticleResponse>>.Succeed(news, "Search news successfully.", 200));
        }

        /// <summary>
        /// Get news created by current user (Staff and Lecturer)
        /// </summary>
        [HttpGet("my-news")]
        [Authorize(Roles = "1,2")]
        public async Task<ActionResult<ApiResponse<IEnumerable<NewsArticleResponse>>>> GetMyNews()
        {
            var accountIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (accountIdClaim == null || !int.TryParse(accountIdClaim.Value, out int accountId))
            {
                return Unauthorized(ApiResponse<IEnumerable<NewsArticleResponse>>.Fail("Invalid token.", 401));
            }

            var news = await _newsService.GetNewsByCreatorAsync(accountId);
            return Ok(ApiResponse<IEnumerable<NewsArticleResponse>>.Succeed(news, "Get my news successfully.", 200));
        }

        /// <summary>
        /// Create news article (Staff and Lecturer)
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "1,2")]
        public async Task<ActionResult<ApiResponse<NewsArticleResponse>>> Create([FromBody] NewsArticleRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<NewsArticleResponse>.Fail("Invalid input.", 400));
            }

            var accountIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (accountIdClaim == null || !int.TryParse(accountIdClaim.Value, out int accountId))
            {
                return Unauthorized(ApiResponse<NewsArticleResponse>.Fail("Invalid token.", 401));
            }

            var news = await _newsService.CreateNewsAsync(request, accountId);
            return CreatedAtAction(nameof(GetById), new { id = news.NewsArticleId }, 
                ApiResponse<NewsArticleResponse>.Succeed(news, "News article created successfully.", 201));
        }

        /// <summary>
        /// Update news article (Staff and Lecturer)
        /// </summary>
        [HttpPut("{id}")]
        [Authorize(Roles = "1,2")]
        public async Task<ActionResult<ApiResponse<NewsArticleResponse>>> Update(int id, [FromBody] NewsArticleUpdateRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<NewsArticleResponse>.Fail("Invalid input.", 400));
            }

            var accountIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (accountIdClaim == null || !int.TryParse(accountIdClaim.Value, out int accountId))
            {
                return Unauthorized(ApiResponse<NewsArticleResponse>.Fail("Invalid token.", 401));
            }

            try
            {
                var news = await _newsService.UpdateNewsAsync(id, request, accountId);
                return Ok(ApiResponse<NewsArticleResponse>.Succeed(news, "News article updated successfully.", 200));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ApiResponse<NewsArticleResponse>.Fail(ex.Message, 404));
            }
        }

        /// <summary>
        /// Delete news article (Staff and Lecturer)
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "1,2")]
        public async Task<ActionResult<ApiResponse<object>>> Delete(int id)
        {
            var result = await _newsService.DeleteNewsAsync(id);
            if (!result)
            {
                return NotFound(ApiResponse<object>.Fail("News article not found.", 404));
            }
            return Ok(ApiResponse<object>.Succeed(new { }, "News article deleted successfully.", 200));
        }

        // ========== ADMIN REPORTS ==========

        /// <summary>
        /// Get news statistics by date range (Admin only)
        /// </summary>
        [HttpGet("statistics")]
        [Authorize(Roles = "3")]
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
        /// Get article counts for dashboard (Admin only)
        /// </summary>
        [HttpGet("counts")]
        [Authorize(Roles = "3")]
        public async Task<ActionResult<ApiResponse<object>>> GetCounts(
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null)
        {
            // Debug: Log user claims
            var userRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            Console.WriteLine($"[DEBUG] GetCounts - UserId: {userId}, Role: {userRole}, IsAuthenticated: {User.Identity?.IsAuthenticated}");
            
            if (startDate.HasValue && endDate.HasValue && startDate > endDate)
            {
                return BadRequest(ApiResponse<object>.Fail("Start date must be before end date.", 400));
            }

            var totalArticles = await _newsService.GetTotalArticlesCountAsync(startDate, endDate);
            var publishedArticles = await _newsService.GetPublishedArticlesCountAsync(startDate, endDate);
            var draftArticles = await _newsService.GetDraftArticlesCountAsync(startDate, endDate);
            var totalAuthors = await _newsService.GetTotalAuthorsCountAsync(startDate, endDate);

            var result = new
            {
                totalArticles,
                publishedArticles,
                draftArticles,
                totalAuthors
            };

            return Ok(ApiResponse<object>.Succeed(result, "Counts retrieved successfully.", 200));
        }
    }
}
