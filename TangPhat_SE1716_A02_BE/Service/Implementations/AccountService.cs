using BusinessObjects;
using BusinessObjects.DTOs;
using Repository.Interfaces;
using Service.Interfaces;

namespace Service.Implementations
{
    public class AccountService : IAccountService
    {
        private readonly IUnitOfWork _unitOfWork;

        public AccountService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<AccountResponse>> GetAllAccountsAsync()
        {
            var accounts = await _unitOfWork.SystemAccounts.GetAllAsync();
            return accounts.Select(MapToResponse);
        }

        public async Task<AccountResponse?> GetAccountByIdAsync(int id)
        {
            var account = await _unitOfWork.SystemAccounts.GetByIdAsync(id);
            return account == null ? null : MapToResponse(account);
        }

        public async Task<IEnumerable<AccountResponse>> SearchAccountsAsync(string? searchTerm)
        {
            var accounts = await _unitOfWork.SystemAccounts.SearchAccountsAsync(searchTerm);
            return accounts.Select(MapToResponse);
        }

        public async Task<AccountResponse> CreateAccountAsync(AccountRequest request)
        {
            // Check if email already exists
            var existingAccount = await _unitOfWork.SystemAccounts.GetByEmailAsync(request.AccountEmail);
            if (existingAccount != null)
            {
                throw new InvalidOperationException("An account with this email already exists.");
            }

            var account = new SystemAccount
            {
                AccountName = request.AccountName,
                AccountEmail = request.AccountEmail,
                AccountRole = request.AccountRole,
                AccountPassword = request.AccountPassword,
                IsActive = request.IsActive
            };

            await _unitOfWork.SystemAccounts.AddAsync(account);
            await _unitOfWork.SaveChangesAsync();
            
            return MapToResponse(account);
        }

        public async Task<AccountResponse> UpdateAccountAsync(int id, AccountUpdateRequest request)
        {
            var account = await _unitOfWork.SystemAccounts.GetByIdAsync(id);
            if (account == null)
            {
                throw new KeyNotFoundException("Account not found.");
            }

            account.AccountName = request.AccountName;
            account.AccountRole = request.AccountRole;
            account.IsActive = request.IsActive;

            if (!string.IsNullOrWhiteSpace(request.AccountPassword))
            {
                account.AccountPassword = request.AccountPassword;
            }

            await _unitOfWork.SystemAccounts.UpdateAsync(account);
            await _unitOfWork.SaveChangesAsync();
            
            return MapToResponse(account);
        }

        public async Task<bool> DeleteAccountAsync(int id)
        {
            var account = await _unitOfWork.SystemAccounts.GetByIdAsync(id);
            if (account == null)
            {
                return false;
            }

            // Check if account has created any news articles
            var hasNews = await _unitOfWork.SystemAccounts.HasCreatedNewsArticlesAsync(id);
            if (hasNews)
            {
                throw new InvalidOperationException("Cannot delete account that has created news articles.");
            }

            await _unitOfWork.SystemAccounts.DeleteAsync(account);
            await _unitOfWork.SaveChangesAsync();
            
            return true;
        }

        public async Task<AccountResponse> UpdateProfileAsync(int accountId, ProfileUpdateRequest request)
        {
            var account = await _unitOfWork.SystemAccounts.GetByIdAsync(accountId);
            if (account == null)
            {
                throw new KeyNotFoundException("Account not found.");
            }

            account.AccountName = request.AccountName;

            if (!string.IsNullOrWhiteSpace(request.AccountPassword))
            {
                account.AccountPassword = request.AccountPassword;
            }

            await _unitOfWork.SystemAccounts.UpdateAsync(account);
            await _unitOfWork.SaveChangesAsync();
            
            return MapToResponse(account);
        }

        private static AccountResponse MapToResponse(SystemAccount account)
        {
            return new AccountResponse
            {
                AccountId = account.AccountId,
                AccountName = account.AccountName,
                AccountEmail = account.AccountEmail,
                AccountRole = account.AccountRole,
                IsActive = account.IsActive
            };
        }
    }
}
