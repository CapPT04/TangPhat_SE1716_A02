using BusinessObjects;
using Microsoft.EntityFrameworkCore.Storage;
using Repository.Interfaces;

namespace Repository.Implementations
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly FunewsManagementSystemContext _context;
        private IDbContextTransaction? _transaction;

        public ISystemAccountRepository SystemAccounts { get; private set; }
        public ICategoryRepository Categories { get; private set; }
        public INewsArticleRepository NewsArticles { get; private set; }
        public ITagRepository Tags { get; private set; }

        public UnitOfWork(FunewsManagementSystemContext context)
        {
            _context = context;
            SystemAccounts = new SystemAccountRepository(_context);
            Categories = new CategoryRepository(_context);
            NewsArticles = new NewsArticleRepository(_context);
            Tags = new TagRepository(_context);
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public async Task BeginTransactionAsync()
        {
            _transaction = await _context.Database.BeginTransactionAsync();
        }

        public async Task CommitTransactionAsync()
        {
            try
            {
                await _context.SaveChangesAsync();
                if (_transaction != null)
                {
                    await _transaction.CommitAsync();
                }
            }
            catch
            {
                await RollbackTransactionAsync();
                throw;
            }
            finally
            {
                if (_transaction != null)
                {
                    await _transaction.DisposeAsync();
                    _transaction = null;
                }
            }
        }

        public async Task RollbackTransactionAsync()
        {
            if (_transaction != null)
            {
                await _transaction.RollbackAsync();
                await _transaction.DisposeAsync();
                _transaction = null;
            }
        }

        public void Dispose()
        {
            _transaction?.Dispose();
            _context.Dispose();
        }
    }
}
