import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Folder, FileText, FolderTree } from 'lucide-react';
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '@/types/category.types';

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCategoryRequest | UpdateCategoryRequest) => Promise<void>;
  category?: Category | null;
  mode: 'create' | 'edit';
  categories: Category[];
}

const CategoryFormModal = ({ isOpen, onClose, onSubmit, category, mode, categories }: CategoryFormModalProps) => {
  const [formData, setFormData] = useState({
    categoryName: '',
    categoryDescription: '',
    parentCategoryId: 0,
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (mode === 'edit' && category) {
      setFormData({
        categoryName: category.categoryName || '',
        categoryDescription: category.categoryDescription || '',
        parentCategoryId: category.parentCategoryId || 0,
        isActive: category.isActive !== false,
      });
    } else {
      setFormData({
        categoryName: '',
        categoryDescription: '',
        parentCategoryId: 0,
        isActive: true,
      });
    }
    setErrors({});
  }, [category, mode, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.categoryName.trim()) {
      newErrors.categoryName = 'Category name is required';
    }

    if (formData.categoryName.length > 150) {
      newErrors.categoryName = 'Category name must be less than 150 characters';
    }

    if (formData.categoryDescription && formData.categoryDescription.length > 500) {
      newErrors.categoryDescription = 'Description must be less than 500 characters';
    }

    // Check if parent category is the same as current category (for edit mode)
    if (mode === 'edit' && category && formData.parentCategoryId === category.categoryId) {
      newErrors.parentCategoryId = 'Cannot set category as its own parent';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const submitData: CreateCategoryRequest | UpdateCategoryRequest = {
        categoryName: formData.categoryName,
        categoryDescription: formData.categoryDescription || undefined,
        parentCategoryId: formData.parentCategoryId > 0 ? formData.parentCategoryId : undefined,
        isActive: formData.isActive,
      };
      
      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else if (type === 'number' || name === 'parentCategoryId') {
      setFormData({
        ...formData,
        [name]: parseInt(value) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // Filter out current category and its children from parent options
  const availableParentCategories = mode === 'edit' && category
    ? categories.filter(c => c.categoryId !== category.categoryId)
    : categories;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-2xl p-8 max-w-md w-full border border-white/20 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Folder className="w-6 h-6" />
                {mode === 'create' ? 'Create New Category' : 'Edit Category'}
              </h2>
              <button
                onClick={onClose}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category Name */}
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  <Folder className="w-4 h-4 inline mr-2" />
                  Category Name *
                </label>
                <input
                  type="text"
                  name="categoryName"
                  value={formData.categoryName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white/10 border ${
                    errors.categoryName ? 'border-red-500' : 'border-white/20'
                  } rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter category name"
                  maxLength={150}
                />
                {errors.categoryName && (
                  <p className="mt-1 text-sm text-red-400">{errors.categoryName}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Description
                </label>
                <textarea
                  name="categoryDescription"
                  value={formData.categoryDescription}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full px-4 py-3 bg-white/10 border ${
                    errors.categoryDescription ? 'border-red-500' : 'border-white/20'
                  } rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
                  placeholder="Enter category description (optional)"
                  maxLength={500}
                />
                {errors.categoryDescription && (
                  <p className="mt-1 text-sm text-red-400">{errors.categoryDescription}</p>
                )}
              </div>

              {/* Parent Category */}
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  <FolderTree className="w-4 h-4 inline mr-2" />
                  Parent Category
                </label>
                <select
                  name="parentCategoryId"
                  value={formData.parentCategoryId}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white/10 border ${
                    errors.parentCategoryId ? 'border-red-500' : 'border-white/20'
                  } rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value={0} className="bg-gray-900">None (Root Category)</option>
                  {availableParentCategories.map((cat) => (
                    <option key={cat.categoryId} value={cat.categoryId} className="bg-gray-900">
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
                {errors.parentCategoryId && (
                  <p className="mt-1 text-sm text-red-400">{errors.parentCategoryId}</p>
                )}
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-5 h-5 rounded bg-white/10 border-white/20 text-blue-500 focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-blue-200 cursor-pointer">
                  Category is Active
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : mode === 'create' ? 'Create' : 'Update'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CategoryFormModal;
