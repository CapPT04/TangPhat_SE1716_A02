using BusinessObjects.DTOs;

namespace Service.Interfaces
{
    public interface ITagService
    {
        Task<IEnumerable<TagResponse>> GetAllTagsAsync();
        Task<TagResponse?> GetTagByIdAsync(int id);
        Task<TagResponse> CreateTagAsync(TagRequest request);
        Task<TagResponse> UpdateTagAsync(int id, TagRequest request);
        Task<bool> DeleteTagAsync(int id);
    }
}
