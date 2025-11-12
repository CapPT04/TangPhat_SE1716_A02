using BusinessObjects.DTOs;
using Microsoft.AspNetCore.Mvc;
using Service.Interfaces;

namespace FUNewsManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        /// <summary>
        /// Login with email and password
        /// </summary>
        [HttpPost("login")]
        public async Task<ActionResult<ApiResponse<LoginResponse>>> Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ApiResponse<LoginResponse>.Fail("Invalid input.", 400));
            }

            var result = await _authService.LoginAsync(request);

            if (result == null)
            {
                return Unauthorized(ApiResponse<LoginResponse>.Fail("Invalid email or password.", 401));
            }

            return Ok(ApiResponse<LoginResponse>.Succeed(result, "Login successful.", 200));
        }
    }
}
