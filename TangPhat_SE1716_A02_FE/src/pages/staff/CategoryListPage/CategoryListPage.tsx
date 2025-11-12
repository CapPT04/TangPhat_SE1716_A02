import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Folder, CheckCircle, XCircle, FolderTree } from 'lucide-react';
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '@/types/category.types';
import { categoryService } from '@/services/category.service';
import CategoryFormModal from '@/components/features/staff/CategoryFormModal';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { toastSuccess, toastError } from '@/utils/toast';

const CategoryListPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error: any) {
      toastError(error.response?.data?.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      loadCategories();
      return;
    }

    try {
      setLoading(true);
      const data = await categoryService.search(searchTerm);
      setCategories(data);
    } catch (error: any) {
      toastError(error.response?.data?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setFormMode('create');
    setSelectedCategory(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (category: Category) => {
    setFormMode('edit');
    setSelectedCategory(category);
    setIsFormModalOpen(true);
  };

  const handleCreateCategory = async (data: CreateCategoryRequest | UpdateCategoryRequest) => {
    try {
      await categoryService.create(data as CreateCategoryRequest);
      toastSuccess('Category created successfully!');
      loadCategories();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create category';
      toastError(errorMessage);
      throw error;
    }
  };

  const handleUpdateCategory = async (data: CreateCategoryRequest | UpdateCategoryRequest) => {
    if (!selectedCategory) return;
    
    try {
      await categoryService.update(selectedCategory.categoryId, data as UpdateCategoryRequest);
      toastSuccess('Category updated successfully!');
      loadCategories();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update category';
      toastError(errorMessage);
      throw error;
    }
  };

  const handleOpenDeleteDialog = (category: Category) => {
    setSelectedCategory(category);
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedCategory) return;

    try {
      await categoryService.delete(selectedCategory.categoryId);
      toastSuccess('Category deleted successfully!');
      loadCategories();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
        'Failed to delete category. The category may contain news articles.';
      toastError(errorMessage);
    }
  };

  const filteredCategories = searchTerm 
    ? categories 
    : categories;

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
            <Folder className="w-10 h-10" />
            Category Management
          </h1>
          <p className="text-blue-200">Manage news categories and hierarchies</p>
        </motion.div>

        {/* Search and Create Bar */}
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
                  placeholder="Search by name or description..."
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
              Create Category
            </button>
          </div>
        </motion.div>

        {/* Categories Table */}
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
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-20 text-blue-200">
              <Folder className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-xl">No categories found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-200">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-200">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-200">Description</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-200">Parent</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-blue-200">Status</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-blue-200">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((category, index) => (
                    <motion.tr
                      key={category.categoryId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 text-white font-mono">{category.categoryId}</td>
                      <td className="px-6 py-4 text-white font-medium flex items-center gap-2">
                        <Folder className="w-4 h-4 text-blue-400" />
                        {category.categoryName}
                      </td>
                      <td className="px-6 py-4 text-blue-200 max-w-xs truncate">
                        {category.categoryDescription || '-'}
                      </td>
                      <td className="px-6 py-4 text-blue-300">
                        {category.parentCategoryName ? (
                          <span className="flex items-center gap-1">
                            <FolderTree className="w-4 h-4" />
                            {category.parentCategoryName}
                          </span>
                        ) : (
                          <span className="text-gray-400">Root</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                          category.isActive 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {category.isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {category.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(category)}
                            className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenDeleteDialog(category)}
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

        {/* Category Form Modal */}
        <CategoryFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSubmit={formMode === 'create' ? handleCreateCategory : handleUpdateCategory}
          category={selectedCategory}
          mode={formMode}
          categories={categories}
        />

        {/* Confirm Delete Dialog */}
        <ConfirmDialog
          isOpen={isConfirmDialogOpen}
          onClose={() => setIsConfirmDialogOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Delete Category"
          message={`Are you sure you want to delete category "${selectedCategory?.categoryName}"? This action cannot be undone. Note: Categories that contain news articles cannot be deleted.`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
        />
      </div>
    </div>
  );
};

export default CategoryListPage;
