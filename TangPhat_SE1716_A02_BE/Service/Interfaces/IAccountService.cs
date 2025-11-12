using BusinessObjects.DTOs;

namespace Service.Interfaces
{
    public interface IAccountService
    {
        Task<IEnumerable<AccountResponse>> GetAllAccountsAsync();
        Task<AccountResponse?> GetAccountByIdAsync(int id);
        Task<IEnumerable<AccountResponse>> SearchAccountsAsync(string? searchTerm);
        Task<AccountResponse> CreateAccountAsync(AccountRequest request);
        Task<AccountResponse> UpdateAccountAsync(int id, AccountUpdateRequest request);
        Task<bool> DeleteAccountAsync(int id);
        Task<AccountResponse> UpdateProfileAsync(int accountId, ProfileUpdateRequest request);
    }
}
