using BusinessObjects.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.Interfaces;
using System.Security.Claims;

namespace FUNewsManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AccountsController : ControllerBase
    {
        private readonly IAccountService _accountService;

        public AccountsController(IAccountService accountService)
        {
            _accountService = accountService;
        }

        /// <summary>
        /// Get all accounts (Admin only)
        /// </summary>
        [HttpGet]
        [Authorize(Roles = "3")]
        public async Task<ActionResult<ApiResponse<IEnumerable<AccountResponse>>>> GetAll()
        {
            var accounts = await _accountService.GetAllAccountsAsync();
            return Ok(ApiResponse<IEnumerable<AccountResponse>>.Succeed(accounts, "Accounts retrieved successfully.", 200));
        }

        /// <summary>
        /// Get account by ID (Admin only)
        /// </summary>
        [HttpGet("{id}")]
        [Authorize(Roles = "3")]
        public async Task<ActionResult<ApiResponse<AccountResponse>>> GetById(int id)
        {
            var account = await _accountService.GetAccountByIdAsync(id);
            if (account == null)
            {
                return NotFound(ApiResponse<AccountResponse>.Fail("Account not found.", 404));
            }
            return Ok(ApiResponse<AccountResponse>.Succeed(account, "Account retrieved successfully.", 200));
        }

        /// <summary>
        /// Search accounts (Admin only)
        /// </summary>
        [HttpGet("search")]
        [Authorize(Roles = "3")]
        public async Task<ActionResult<ApiResponse<IEnumerable<AccountResponse>>>> Search([FromQuery] string? searchTerm)
        {
            var accounts = await _accountService.SearchAccountsAsync(searchTerm);
            return Ok(ApiResponse<IEnumerable<AccountResponse>>.Succeed(accounts, "Search completed successfully.", 200));
        }

        /// <summary>
        /// Create new account (Admin only)
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "3")]
        public async Task<ActionResult<ApiResponse<AccountResponse>>> Create([FromBody] AccountRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<AccountResponse>.Fail("Invalid input.", 400));
            }

            try
            {
                var account = await _accountService.CreateAccountAsync(request);
                return CreatedAtAction(nameof(GetById), new { id = account.AccountId }, 
                    ApiResponse<AccountResponse>.Succeed(account, "Account created successfully.", 201));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ApiResponse<AccountResponse>.Fail(ex.Message, 400));
            }
        }

        /// <summary>
        /// Update account (Admin only)
        /// </summary>
        [HttpPut("{id}")]
        [Authorize(Roles = "3")]
        public async Task<ActionResult<ApiResponse<AccountResponse>>> Update(int id, [FromBody] AccountUpdateRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<AccountResponse>.Fail("Invalid input.", 400));
            }

            try
            {
                var account = await _accountService.UpdateAccountAsync(id, request);
                return Ok(ApiResponse<AccountResponse>.Succeed(account, "Account updated successfully.", 200));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ApiResponse<AccountResponse>.Fail(ex.Message, 404));
            }
        }

        /// <summary>
        /// Delete account (Admin only)
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "3")]
        public async Task<ActionResult<ApiResponse<object>>> Delete(int id)
        {
            try
            {
                var result = await _accountService.DeleteAccountAsync(id);
                if (!result)
                {
                    return NotFound(ApiResponse<object>.Fail("Account not found.", 404));
                }
                return Ok(ApiResponse<object>.Succeed(new { }, "Account deleted successfully.", 200));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ApiResponse<object>.Fail(ex.Message, 400));
            }
        }

        /// <summary>
        /// Update own profile 
        /// </summary>
        [HttpPut("profile")]
        public async Task<ActionResult<ApiResponse<AccountResponse>>> UpdateProfile([FromBody] ProfileUpdateRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<AccountResponse>.Fail("Invalid input.", 400));
            }

            var accountIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (accountIdClaim == null || !int.TryParse(accountIdClaim.Value, out int accountId))
            {
                return Unauthorized(ApiResponse<AccountResponse>.Fail("Invalid token.", 401));
            }

            try
            {
                var account = await _accountService.UpdateProfileAsync(accountId, request);
                return Ok(ApiResponse<AccountResponse>.Succeed(account, "Profile updated successfully.", 200));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ApiResponse<AccountResponse>.Fail(ex.Message, 404));
            }
        }

        /// <summary>
        /// Get total users count (Admin only - for reports)
        /// </summary>
        [HttpGet("count")]
        [Authorize(Roles = "3")]
        public async Task<ActionResult<ApiResponse<int>>> GetCount()
        {
            var accounts = await _accountService.GetAllAccountsAsync();
            return Ok(ApiResponse<int>.Succeed(accounts.Count(), "Count retrieved successfully.", 200));
        }
    }
}
