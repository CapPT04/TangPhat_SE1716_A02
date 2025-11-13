using BusinessObjects;
using BusinessObjects.DTOs;
using Repository.Interfaces;
using Service.Interfaces;

namespace Service.Implementations
{
    public class TagService : ITagService
    {
        private readonly ITagRepository _tagRepo;

        public TagService(ITagRepository tagRepo)
        {
            _tagRepo = tagRepo;
        }

        public async Task<IEnumerable<TagResponse>> GetAllTagsAsync()
        {
            var tags = await _tagRepo.GetAllAsync();
            return tags.Select(MapToResponse);
        }

        public async Task<TagResponse?> GetTagByIdAsync(int id)
        {
            var tag = await _tagRepo.GetByIdAsync(id);
            return tag == null ? null : MapToResponse(tag);
        }

        public async Task<TagResponse> CreateTagAsync(TagRequest request)
        {
            // Check if tag name already exists
            var existingTag = await _tagRepo.GetByNameAsync(request.TagName);
            if (existingTag != null)
            {
                throw new InvalidOperationException("A tag with this name already exists.");
            }

            var tag = new Tag
            {
                TagName = request.TagName,
                Note = request.Note
            };

            await _tagRepo.AddAsync(tag);
            await _tagRepo.SaveChangesAsync();
            
            return MapToResponse(tag);
        }

        public async Task<TagResponse> UpdateTagAsync(int id, TagRequest request)
        {
            var tag = await _tagRepo.GetByIdAsync(id);
            if (tag == null)
            {
                throw new KeyNotFoundException("Tag not found.");
            }

            // Check if new tag name already exists (excluding current tag)
            var existingTag = await _tagRepo.GetByNameAsync(request.TagName);
            if (existingTag != null && existingTag.TagId != id)
            {
                throw new InvalidOperationException("A tag with this name already exists.");
            }

            tag.TagName = request.TagName;
            tag.Note = request.Note;

            await _tagRepo.UpdateAsync(tag);
            await _tagRepo.SaveChangesAsync();
            
            return MapToResponse(tag);
        }

        public async Task<bool> DeleteTagAsync(int id)
        {
            var tag = await _tagRepo.GetByIdAsync(id);
            if (tag == null)
            {
                return false;
            }

            // Check if tag is being used by any news articles
            var isUsed = await _tagRepo.IsTagUsedAsync(id);
            if (isUsed)
            {
                throw new InvalidOperationException("Cannot delete tag because it is being used by one or more news articles.");
            }

            await _tagRepo.DeleteAsync(tag);
            await _tagRepo.SaveChangesAsync();
            
            return true;
        }

        private static TagResponse MapToResponse(Tag tag)
        {
            return new TagResponse
            {
                TagId = tag.TagId,
                TagName = tag.TagName,
                Note = tag.Note
            };
        }
    }
}
