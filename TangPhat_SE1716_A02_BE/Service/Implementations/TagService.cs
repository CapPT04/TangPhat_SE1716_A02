using BusinessObjects;
using BusinessObjects.DTOs;
using Repository.Interfaces;
using Service.Interfaces;

namespace Service.Implementations
{
    public class TagService : ITagService
    {
        private readonly IUnitOfWork _unitOfWork;

        public TagService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<TagResponse>> GetAllTagsAsync()
        {
            var tags = await _unitOfWork.Tags.GetAllAsync();
            return tags.Select(MapToResponse);
        }

        public async Task<TagResponse?> GetTagByIdAsync(int id)
        {
            var tag = await _unitOfWork.Tags.GetByIdAsync(id);
            return tag == null ? null : MapToResponse(tag);
        }

        public async Task<TagResponse> CreateTagAsync(TagRequest request)
        {
            // Check if tag name already exists
            var existingTag = await _unitOfWork.Tags.GetByNameAsync(request.TagName);
            if (existingTag != null)
            {
                throw new InvalidOperationException("A tag with this name already exists.");
            }

            var tag = new Tag
            {
                TagName = request.TagName,
                Note = request.Note
            };

            await _unitOfWork.Tags.AddAsync(tag);
            await _unitOfWork.SaveChangesAsync();
            
            return MapToResponse(tag);
        }

        public async Task<TagResponse> UpdateTagAsync(int id, TagRequest request)
        {
            var tag = await _unitOfWork.Tags.GetByIdAsync(id);
            if (tag == null)
            {
                throw new KeyNotFoundException("Tag not found.");
            }

            // Check if new tag name already exists (excluding current tag)
            var existingTag = await _unitOfWork.Tags.GetByNameAsync(request.TagName);
            if (existingTag != null && existingTag.TagId != id)
            {
                throw new InvalidOperationException("A tag with this name already exists.");
            }

            tag.TagName = request.TagName;
            tag.Note = request.Note;

            await _unitOfWork.Tags.UpdateAsync(tag);
            await _unitOfWork.SaveChangesAsync();
            
            return MapToResponse(tag);
        }

        public async Task<bool> DeleteTagAsync(int id)
        {
            var tag = await _unitOfWork.Tags.GetByIdAsync(id);
            if (tag == null)
            {
                return false;
            }

            await _unitOfWork.Tags.DeleteAsync(tag);
            await _unitOfWork.SaveChangesAsync();
            
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
