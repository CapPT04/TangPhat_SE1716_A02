using BusinessObjects.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.Interfaces;

namespace FUNewsManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "1,2,3")]
    public class TagsController : ControllerBase
    {
        private readonly ITagService _tagService;

        public TagsController(ITagService tagService)
        {
            _tagService = tagService;
        }

        /// <summary>
        /// Get all tags (Staff only)
        /// </summary>
        [HttpGet]
         [Authorize(Roles = "1,2,3")]
        public async Task<ActionResult<ApiResponse<IEnumerable<TagResponse>>>> GetAll()
        {
            var tags = await _tagService.GetAllTagsAsync();
            return Ok(ApiResponse<IEnumerable<TagResponse>>.Succeed(tags, "Tags retrieved successfully.", 200));
        }

        /// <summary>
        /// Get tag by ID (Staff only)
        /// </summary>
        [HttpGet("{id}")]
         [Authorize(Roles = "1")]
        public async Task<ActionResult<ApiResponse<TagResponse>>> GetById(int id)
        {
            var tag = await _tagService.GetTagByIdAsync(id);
            if (tag == null)
            {
                return NotFound(ApiResponse<TagResponse>.Fail("Tag not found.", 404));
            }
            return Ok(ApiResponse<TagResponse>.Succeed(tag, "Tag retrieved successfully.", 200));
        }

        /// <summary>
        /// Create new tag (Staff only)
        /// </summary>
        [HttpPost]
         [Authorize(Roles = "1")]
        public async Task<ActionResult<ApiResponse<TagResponse>>> Create([FromBody] TagRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<TagResponse>.Fail("Invalid input.", 400));
            }

            try
            {
                var tag = await _tagService.CreateTagAsync(request);
                return CreatedAtAction(nameof(GetById), new { id = tag.TagId }, 
                    ApiResponse<TagResponse>.Succeed(tag, "Tag created successfully.", 201));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ApiResponse<TagResponse>.Fail(ex.Message, 400));
            }
        }

        /// <summary>
        /// Update tag (Staff only)
        /// </summary>
        [HttpPut("{id}")]
         [Authorize(Roles = "1")]
        public async Task<ActionResult<ApiResponse<TagResponse>>> Update(int id, [FromBody] TagRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<TagResponse>.Fail("Invalid input.", 400));
            }

            try
            {
                var tag = await _tagService.UpdateTagAsync(id, request);
                return Ok(ApiResponse<TagResponse>.Succeed(tag, "Tag updated successfully.", 200));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ApiResponse<TagResponse>.Fail(ex.Message, 404));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ApiResponse<TagResponse>.Fail(ex.Message, 400));
            }
        }

        /// <summary>
        /// Delete tag (Staff and Lecturer)
        /// </summary>
        [HttpDelete("{id}")]
         [Authorize(Roles = "1,2")]
        public async Task<ActionResult<ApiResponse<object>>> Delete(int id)
        {
            try
            {
                var result = await _tagService.DeleteTagAsync(id);
                if (!result)
                {
                    return NotFound(ApiResponse<object>.Fail("Tag not found.", 404));
                }
                return Ok(ApiResponse<object>.Succeed(new { }, "Tag deleted successfully.", 200));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ApiResponse<object>.Fail(ex.Message, 400));
            }
        }

        /// <summary>
        /// Get total tags count (Admin only - for reports)
        /// </summary>
        [HttpGet("count")]
        [Authorize(Roles = "3")]
        public async Task<ActionResult<ApiResponse<int>>> GetCount()
        {
            var tags = await _tagService.GetAllTagsAsync();
            return Ok(ApiResponse<int>.Succeed(tags.Count(), "Count retrieved successfully.", 200));
        }
    }
}
