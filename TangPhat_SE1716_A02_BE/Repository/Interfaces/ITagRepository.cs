using BusinessObjects;

namespace Repository.Interfaces
{
    public interface ITagRepository : IGenericRepository<Tag>
    {
        Task<IEnumerable<Tag>> GetByIdsAsync(List<int> ids);
        Task<Tag?> GetByNameAsync(string tagName);
    }
}
