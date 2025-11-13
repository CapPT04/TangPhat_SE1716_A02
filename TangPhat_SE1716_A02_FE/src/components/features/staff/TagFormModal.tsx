import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Tag as TagIcon, FileText } from 'lucide-react';
import { Tag, CreateTagRequest, UpdateTagRequest } from '@/types/news.types';

interface TagFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTagRequest | UpdateTagRequest) => Promise<void>;
  tag?: Tag | null;
  mode: 'create' | 'edit';
}

const TagFormModal = ({ isOpen, onClose, onSubmit, tag, mode }: TagFormModalProps) => {
  const [formData, setFormData] = useState({
    tagName: '',
    note: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (mode === 'edit' && tag) {
      setFormData({
        tagName: tag.tagName || '',
        note: tag.note || '',
      });
    } else {
      setFormData({
        tagName: '',
        note: '',
      });
    }
    setErrors({});
  }, [tag, mode, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.tagName.trim()) {
      newErrors.tagName = 'Tag name is required';
    }

    if (formData.tagName.length > 50) {
      newErrors.tagName = 'Tag name must be less than 50 characters';
    }

    if (formData.note && formData.note.length > 200) {
      newErrors.note = 'Note must be less than 200 characters';
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
      const submitData: CreateTagRequest | UpdateTagRequest = {
        tagName: formData.tagName,
        note: formData.note || undefined,
      };
      
      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

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
                <TagIcon className="w-6 h-6" />
                {mode === 'create' ? 'Create New Tag' : 'Edit Tag'}
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
              {/* Tag Name */}
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  <TagIcon className="w-4 h-4 inline mr-2" />
                  Tag Name *
                </label>
                <input
                  type="text"
                  name="tagName"
                  value={formData.tagName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white/10 border ${
                    errors.tagName ? 'border-red-500' : 'border-white/20'
                  } rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter tag name"
                  maxLength={50}
                />
                {errors.tagName && (
                  <p className="mt-1 text-sm text-red-400">{errors.tagName}</p>
                )}
              </div>

              {/* Note */}
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Note
                </label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full px-4 py-3 bg-white/10 border ${
                    errors.note ? 'border-red-500' : 'border-white/20'
                  } rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
                  placeholder="Enter tag note (optional)"
                  maxLength={200}
                />
                {errors.note && (
                  <p className="mt-1 text-sm text-red-400">{errors.note}</p>
                )}
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

export default TagFormModal;
