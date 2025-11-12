import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, AlignLeft, Folder, Tag as TagIcon, Link, ToggleLeft, Save } from 'lucide-react';
import { NewsArticle, CreateNewsArticleRequest, UpdateNewsArticleRequest, Tag } from '@/types/news.types';
import { Category } from '@/types/category.types';

interface NewsArticleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateNewsArticleRequest | UpdateNewsArticleRequest) => Promise<void>;
  newsArticle?: NewsArticle | null;
  mode: 'create' | 'edit';
  categories: Category[];
  tags: Tag[];
}

const NewsArticleFormModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  newsArticle, 
  mode, 
  categories,
  tags 
}: NewsArticleFormModalProps) => {
  const [formData, setFormData] = useState({
    newsTitle: '',
    headline: '',
    newsContent: '',
    newsSource: '',
    categoryId: 0,
    newsStatus: true,
    tagIds: [] as number[],
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (mode === 'edit' && newsArticle) {
      setFormData({
        newsTitle: newsArticle.newsTitle || '',
        headline: newsArticle.headline || '',
        newsContent: newsArticle.newsContent || '',
        newsSource: newsArticle.newsSource || '',
        categoryId: newsArticle.categoryId || 0,
        newsStatus: newsArticle.newsStatus !== false,
        tagIds: newsArticle.tags?.map(t => t.tagId) || [],
      });
    } else {
      setFormData({
        newsTitle: '',
        headline: '',
        newsContent: '',
        newsSource: '',
        categoryId: categories.length > 0 ? categories[0].categoryId : 0,
        newsStatus: true,
        tagIds: [],
      });
    }
    setErrors({});
  }, [newsArticle, mode, isOpen, categories]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.newsTitle.trim()) {
      newErrors.newsTitle = 'Title is required';
    } else if (formData.newsTitle.length > 255) {
      newErrors.newsTitle = 'Title must be less than 255 characters';
    }

    if (formData.headline && formData.headline.length > 500) {
      newErrors.headline = 'Headline must be less than 500 characters';
    }

    if (!formData.newsContent.trim()) {
      newErrors.newsContent = 'Content is required';
    }

    if (formData.newsSource && formData.newsSource.length > 255) {
      newErrors.newsSource = 'Source must be less than 255 characters';
    }

    if (!formData.categoryId || formData.categoryId === 0) {
      newErrors.categoryId = 'Please select a category';
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
      const submitData: CreateNewsArticleRequest | UpdateNewsArticleRequest = {
        newsTitle: formData.newsTitle,
        headline: formData.headline || undefined,
        newsContent: formData.newsContent,
        newsSource: formData.newsSource || undefined,
        categoryId: formData.categoryId,
        newsStatus: formData.newsStatus,
        tagIds: formData.tagIds.length > 0 ? formData.tagIds : undefined,
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
    } else if (type === 'number' || name === 'categoryId') {
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

  const handleTagToggle = (tagId: number) => {
    setFormData({
      ...formData,
      tagIds: formData.tagIds.includes(tagId)
        ? formData.tagIds.filter(id => id !== tagId)
        : [...formData.tagIds, tagId],
    });
  };

  const activeCategories = categories.filter(c => c.isActive);

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
            className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6 sticky top-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 pb-4 z-10">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <FileText className="w-6 h-6" />
                {mode === 'create' ? 'Create News Article' : 'Edit News Article'}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    <FileText className="w-4 h-4 inline mr-2" />
                    Title *
                  </label>
                  <input
                    type="text"
                    name="newsTitle"
                    value={formData.newsTitle}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/10 border ${
                      errors.newsTitle ? 'border-red-500' : 'border-white/20'
                    } rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter news title"
                    maxLength={255}
                  />
                  {errors.newsTitle && (
                    <p className="mt-1 text-sm text-red-400">{errors.newsTitle}</p>
                  )}
                </div>

                {/* Headline */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    <AlignLeft className="w-4 h-4 inline mr-2" />
                    Headline
                  </label>
                  <input
                    type="text"
                    name="headline"
                    value={formData.headline}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/10 border ${
                      errors.headline ? 'border-red-500' : 'border-white/20'
                    } rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter headline (optional)"
                    maxLength={500}
                  />
                  {errors.headline && (
                    <p className="mt-1 text-sm text-red-400">{errors.headline}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    <Folder className="w-4 h-4 inline mr-2" />
                    Category *
                  </label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/10 border ${
                      errors.categoryId ? 'border-red-500' : 'border-white/20'
                    } rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value={0} className="bg-gray-900">Select a category</option>
                    {activeCategories.map((cat) => (
                      <option key={cat.categoryId} value={cat.categoryId} className="bg-gray-900">
                        {cat.categoryName}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <p className="mt-1 text-sm text-red-400">{errors.categoryId}</p>
                  )}
                </div>

                {/* Source */}
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    <Link className="w-4 h-4 inline mr-2" />
                    Source
                  </label>
                  <input
                    type="text"
                    name="newsSource"
                    value={formData.newsSource}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/10 border ${
                      errors.newsSource ? 'border-red-500' : 'border-white/20'
                    } rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter news source (optional)"
                    maxLength={255}
                  />
                  {errors.newsSource && (
                    <p className="mt-1 text-sm text-red-400">{errors.newsSource}</p>
                  )}
                </div>

                {/* Content */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    <FileText className="w-4 h-4 inline mr-2" />
                    Content *
                  </label>
                  <textarea
                    name="newsContent"
                    value={formData.newsContent}
                    onChange={handleChange}
                    rows={8}
                    className={`w-full px-4 py-3 bg-white/10 border ${
                      errors.newsContent ? 'border-red-500' : 'border-white/20'
                    } rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
                    placeholder="Enter news content"
                  />
                  {errors.newsContent && (
                    <p className="mt-1 text-sm text-red-400">{errors.newsContent}</p>
                  )}
                </div>

                {/* Tags */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    <TagIcon className="w-4 h-4 inline mr-2" />
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 p-4 bg-white/5 rounded-xl border border-white/10 min-h-[60px]">
                    {tags.length === 0 ? (
                      <p className="text-blue-300/50 text-sm">No tags available</p>
                    ) : (
                      tags.map((tag) => (
                        <button
                          key={tag.tagId}
                          type="button"
                          onClick={() => handleTagToggle(tag.tagId)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                            formData.tagIds.includes(tag.tagId)
                              ? 'bg-blue-500 text-white border-2 border-blue-400'
                              : 'bg-white/10 text-blue-200 border border-white/20 hover:bg-white/20'
                          }`}
                        >
                          {tag.tagName}
                        </button>
                      ))
                    )}
                  </div>
                </div>

                {/* Status */}
                <div className="md:col-span-2">
                  <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                    <input
                      type="checkbox"
                      id="newsStatus"
                      name="newsStatus"
                      checked={formData.newsStatus}
                      onChange={handleChange}
                      className="w-5 h-5 rounded bg-white/10 border-white/20 text-blue-500 focus:ring-2 focus:ring-blue-500"
                    />
                    <label htmlFor="newsStatus" className="text-sm font-medium text-blue-200 cursor-pointer flex items-center gap-2">
                      <ToggleLeft className="w-4 h-4" />
                      Publish this article (Active status)
                    </label>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 sticky bottom-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 pt-4">
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
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Saving...' : mode === 'create' ? 'Create Article' : 'Update Article'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default NewsArticleFormModal;
