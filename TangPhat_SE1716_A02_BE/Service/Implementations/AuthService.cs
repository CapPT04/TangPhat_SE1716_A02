using BusinessObjects.DTOs;
using Microsoft.Extensions.Configuration;
using Repository.Interfaces;
using Service.Interfaces;

namespace Service.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IJWTService _jwtService;
        private readonly IConfiguration _configuration;

        public AuthService(IUnitOfWork unitOfWork, IJWTService jwtService, IConfiguration configuration)
        {
            _unitOfWork = unitOfWork;
            _jwtService = jwtService;
            _configuration = configuration;
        }

        public async Task<LoginResponse?> LoginAsync(LoginRequest request)
        {
            // Check admin account from appsettings first
            var adminEmail = _configuration["DefaultAdmin:Email"];
            var adminPassword = _configuration["DefaultAdmin:Password"];
            var adminName = _configuration["DefaultAdmin:Name"];
            var adminRole = int.Parse(_configuration["DefaultAdmin:Role"] ?? "3");

            if (!string.IsNullOrEmpty(adminEmail) && 
                request.Email.Equals(adminEmail, StringComparison.OrdinalIgnoreCase) &&
                request.Password == adminPassword)
            {
                // Admin login from appsettings
                var token = _jwtService.GenerateToken(
                    0, // Admin ID = 0 (not from database)
                    adminName ?? "Administrator",
                    adminEmail,
                    adminRole
                );

                return new LoginResponse
                {
                    AccountId = 0,
                    AccountName = adminName ?? "Administrator",
                    AccountEmail = adminEmail,
                    AccountRole = adminRole,
                    Token = token
                };
            }

            // Check regular accounts from database
            var account = await _unitOfWork.SystemAccounts.GetByEmailAsync(request.Email);

            if (account == null || account.AccountPassword != request.Password || !account.IsActive)
            {
                return null;
            }

            var userToken = _jwtService.GenerateToken(
                account.AccountId,
                account.AccountName ?? account.AccountEmail,
                account.AccountEmail,
                account.AccountRole
            );

            return new LoginResponse
            {
                AccountId = account.AccountId,
                AccountName = account.AccountName ?? "",
                AccountEmail = account.AccountEmail,
                AccountRole = account.AccountRole,
                Token = userToken
            };
        }
    }
}
