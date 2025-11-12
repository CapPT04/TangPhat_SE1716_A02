using BusinessObjects;
using Microsoft.EntityFrameworkCore;
using Repository.Interfaces;

namespace Repository.Implementations
{
    public class TagRepository : GenericRepository<Tag>, ITagRepository
    {
        public TagRepository(FunewsManagementSystemContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Tag>> GetByIdsAsync(List<int> ids)
        {
            return await _dbSet.Where(t => ids.Contains(t.TagId)).ToListAsync();
        }

        public async Task<Tag?> GetByNameAsync(string tagName)
        {
            return await _dbSet.FirstOrDefaultAsync(t => t.TagName == tagName);
        }
    }
}
