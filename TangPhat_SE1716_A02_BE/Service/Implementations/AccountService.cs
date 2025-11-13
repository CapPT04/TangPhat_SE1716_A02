using BusinessObjects;
using BusinessObjects.DTOs;
using Repository.Interfaces;
using Service.Interfaces;

namespace Service.Implementations
{
    public class AccountService : IAccountService
    {
        private readonly ISystemAccountRepository _accountRepo;

        public AccountService(ISystemAccountRepository accountRepo)
        {
            _accountRepo = accountRepo;
        }

        public async Task<IEnumerable<AccountResponse>> GetAllAccountsAsync()
        {
            var accounts = await _accountRepo.GetAllAsync();
            return accounts.Select(MapToResponse);
        }

        public async Task<AccountResponse?> GetAccountByIdAsync(int id)
        {
            var account = await _accountRepo.GetByIdAsync(id);
            return account == null ? null : MapToResponse(account);
        }

        public async Task<IEnumerable<AccountResponse>> SearchAccountsAsync(string? searchTerm)
        {
            var accounts = await _accountRepo.SearchAccountsAsync(searchTerm);
            return accounts.Select(MapToResponse);
        }

        public async Task<AccountResponse> CreateAccountAsync(AccountRequest request)
        {
            // Check if email already exists
            var existingAccount = await _accountRepo.GetByEmailAsync(request.AccountEmail);
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

            await _accountRepo.AddAsync(account);
            await _accountRepo.SaveChangesAsync();
            
            return MapToResponse(account);
        }

        public async Task<AccountResponse> UpdateAccountAsync(int id, AccountUpdateRequest request)
        {
            var account = await _accountRepo.GetByIdAsync(id);
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

            await _accountRepo.UpdateAsync(account);
            await _accountRepo.SaveChangesAsync();
            
            return MapToResponse(account);
        }

        public async Task<bool> DeleteAccountAsync(int id)
        {
            var account = await _accountRepo.GetByIdAsync(id);
            if (account == null)
            {
                return false;
            }

            // Check if account has created any news articles
            var hasNews = await _accountRepo.HasCreatedNewsArticlesAsync(id);
            if (hasNews)
            {
                throw new InvalidOperationException("Cannot delete account that has created news articles.");
            }

            await _accountRepo.DeleteAsync(account);
            await _accountRepo.SaveChangesAsync();
            
            return true;
        }

        public async Task<AccountResponse> UpdateProfileAsync(int accountId, ProfileUpdateRequest request)
        {
            var account = await _accountRepo.GetByIdAsync(accountId);
            if (account == null)
            {
                throw new KeyNotFoundException("Account not found.");
            }

            account.AccountName = request.AccountName;

            if (!string.IsNullOrWhiteSpace(request.AccountPassword))
            {
                account.AccountPassword = request.AccountPassword;
            }

            await _accountRepo.UpdateAsync(account);
            await _accountRepo.SaveChangesAsync();
            
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
