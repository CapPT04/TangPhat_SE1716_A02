using BusinessObjects;

namespace Repository.Interfaces
{
    public interface ISystemAccountRepository : IGenericRepository<SystemAccount>
    {
        Task<SystemAccount?> GetByEmailAsync(string email);
        Task<bool> HasCreatedNewsArticlesAsync(int accountId);
        Task<IEnumerable<SystemAccount>> SearchAccountsAsync(string? searchTerm);
    }
}
