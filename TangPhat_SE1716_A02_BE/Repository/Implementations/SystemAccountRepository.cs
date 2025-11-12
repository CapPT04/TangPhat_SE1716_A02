using BusinessObjects;
using Microsoft.EntityFrameworkCore;
using Repository.Interfaces;

namespace Repository.Implementations
{
    public class SystemAccountRepository : GenericRepository<SystemAccount>, ISystemAccountRepository
    {
        public SystemAccountRepository(FunewsManagementSystemContext context) : base(context)
        {
        }

        public async Task<SystemAccount?> GetByEmailAsync(string email)
        {
            return await _dbSet.FirstOrDefaultAsync(a => a.AccountEmail == email);
        }

        public async Task<bool> HasCreatedNewsArticlesAsync(int accountId)
        {
            return await _context.NewsArticles.AnyAsync(n => n.CreatedById == accountId);
        }

        public async Task<IEnumerable<SystemAccount>> SearchAccountsAsync(string? searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
            {
                return await GetAllAsync();
            }

            return await _dbSet
                .Where(a => a.AccountName!.Contains(searchTerm) || 
                           a.AccountEmail.Contains(searchTerm))
                .ToListAsync();
        }
    }
}
