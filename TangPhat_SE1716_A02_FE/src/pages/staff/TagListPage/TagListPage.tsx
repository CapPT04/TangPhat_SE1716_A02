import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Tag as TagIcon } from 'lucide-react';
import { Tag, CreateTagRequest, UpdateTagRequest } from '@/types/news.types';
import { tagService } from '@/services/tag.service';
import TagFormModal from '@/components/features/staff/TagFormModal';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { toastSuccess, toastError } from '@/utils/toast';

const TagListPage = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      setLoading(true);
      const data = await tagService.getAll();
      setTags(data);
    } catch (error: any) {
      toastError(error.response?.data?.message || 'Failed to load tags');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      loadTags();
      return;
    }

    try {
      setLoading(true);
      const data = await tagService.search(searchTerm);
      setTags(data);
    } catch (error: any) {
      toastError(error.response?.data?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setFormMode('create');
    setSelectedTag(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (tag: Tag) => {
    setFormMode('edit');
    setSelectedTag(tag);
    setIsFormModalOpen(true);
  };

  const handleCreateTag = async (data: CreateTagRequest | UpdateTagRequest) => {
    try {
      await tagService.create(data as CreateTagRequest);
      toastSuccess('Tag created successfully!');
      loadTags();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create tag';
      toastError(errorMessage);
      throw error;
    }
  };

  const handleUpdateTag = async (data: CreateTagRequest | UpdateTagRequest) => {
    if (!selectedTag) return;
    
    try {
      await tagService.update(selectedTag.tagId, data as UpdateTagRequest);
      toastSuccess('Tag updated successfully!');
      loadTags();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update tag';
      toastError(errorMessage);
      throw error;
    }
  };

  const handleOpenDeleteDialog = (tag: Tag) => {
    setSelectedTag(tag);
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedTag) return;

    try {
      await tagService.delete(selectedTag.tagId);
      toastSuccess('Tag deleted successfully!');
      loadTags();
    } catch (error: any) {
      let errorMessage = 'Failed to delete tag';
      
      if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to delete this tag';
      } else if (error.response?.status === 404) {
        errorMessage = 'Tag not found';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toastError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <TagIcon className="w-10 h-10" />
            Tag Management
          </h1>
          <p className="text-blue-200">Manage tags for organizing news articles</p>
        </motion.div>

        {/* Search and Add Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <form onSubmit={handleSearch} className="flex-1 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
                <input
                  type="text"
                  placeholder="Search tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </form>

            <button
              onClick={handleOpenCreateModal}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              Add Tag
            </button>
          </div>
        </motion.div>

        {/* Tags Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden"
        >
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          ) : tags.length === 0 ? (
            <div className="text-center py-20 text-blue-200">
              <TagIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-xl">No tags found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-200">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-200">Tag Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-200">Note</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-blue-200">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tags.map((tag, index) => (
                    <motion.tr
                      key={tag.tagId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 text-white font-mono">{tag.tagId}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg border border-blue-500/30 font-medium">
                            #{tag.tagName}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-blue-200">
                        {tag.note || <span className="text-gray-500">-</span>}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(tag)}
                            className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenDeleteDialog(tag)}
                            className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Tag Form Modal */}
        <TagFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSubmit={formMode === 'create' ? handleCreateTag : handleUpdateTag}
          tag={selectedTag}
          mode={formMode}
        />

        {/* Confirm Delete Dialog */}
        <ConfirmDialog
          isOpen={isConfirmDialogOpen}
          onClose={() => setIsConfirmDialogOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Delete Tag"
          message={`Are you sure you want to delete "${selectedTag?.tagName}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
        />
      </div>
    </div>
  );
};

export default TagListPage;
