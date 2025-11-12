import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { History, FileText, Calendar, Folder, CheckCircle, XCircle, Plus, Edit, Trash2 } from 'lucide-react';
import { NewsArticle, CreateNewsArticleRequest, UpdateNewsArticleRequest, Tag } from '@/types/news.types';
import { Category } from '@/types/category.types';
import { newsService } from '@/services/news.service';
import { categoryService } from '@/services/category.service';
import { tagService } from '@/services/tag.service';
import NewsArticleFormModal from '@/components/features/staff/NewsArticleFormModal';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { toastSuccess, toastError } from '@/utils/toast';

const NewsHistoryPage = () => {
  const navigate = useNavigate();
  const [myNews, setMyNews] = useState<NewsArticle[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsArticle | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [newsData, categoriesData, tagsData] = await Promise.all([
        newsService.getMyNews(),
        categoryService.getAll(),
        tagService.getAll(),
      ]);
      setMyNews(newsData);
      setCategories(categoriesData);
      setTags(tagsData);
    } catch (error: any) {
      toastError(error.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setFormMode('create');
    setSelectedNews(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (news: NewsArticle) => {
    setFormMode('edit');
    setSelectedNews(news);
    setIsFormModalOpen(true);
  };

  const handleCreateNews = async (data: CreateNewsArticleRequest | UpdateNewsArticleRequest) => {
    try {
      await newsService.create(data as CreateNewsArticleRequest);
      toastSuccess('News article created successfully!');
      loadData();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create news article';
      toastError(errorMessage);
      throw error;
    }
  };

  const handleUpdateNews = async (data: CreateNewsArticleRequest | UpdateNewsArticleRequest) => {
    if (!selectedNews) return;
    
    try {
      await newsService.update(selectedNews.newsArticleId, data as UpdateNewsArticleRequest);
      toastSuccess('News article updated successfully!');
      loadData();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update news article';
      toastError(errorMessage);
      throw error;
    }
  };

  const handleOpenDeleteDialog = (news: NewsArticle) => {
    setSelectedNews(news);
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedNews) return;

    try {
      await newsService.delete(selectedNews.newsArticleId);
      toastSuccess('News article deleted successfully!');
      loadData();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete news article';
      toastError(errorMessage);
    }
  };

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <History className="w-10 h-10" />
              My News
            </h1>
            <p className="text-blue-200">Manage your news articles</p>
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Create Article
          </button>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-blue-200 text-sm">Total Articles</p>
                <p className="text-white text-2xl font-bold">{myNews.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-blue-200 text-sm">Published</p>
                <p className="text-white text-2xl font-bold">
                  {myNews.filter(n => n.newsStatus).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-500/20 rounded-xl flex items-center justify-center">
                <XCircle className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <p className="text-blue-200 text-sm">Drafts</p>
                <p className="text-white text-2xl font-bold">
                  {myNews.filter(n => !n.newsStatus).length}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* News List */}
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
          ) : myNews.length === 0 ? (
            <div className="text-center py-20 text-blue-200">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-xl">You haven't created any news articles yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-200">Title</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-200">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-200">Created Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-200">Last Modified</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-blue-200">Status</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-blue-200">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {myNews.map((news, index) => (
                    <motion.tr
                      key={news.newsArticleId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="text-white font-medium max-w-md">
                          {news.newsTitle}
                        </div>
                        {news.headline && (
                          <div className="text-blue-300 text-sm mt-1 truncate max-w-md">
                            {news.headline}
                          </div>
                        )}
                        {news.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {news.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag.tagId}
                                className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded text-xs border border-blue-500/30"
                              >
                                {tag.tagName}
                              </span>
                            ))}
                            {news.tags.length > 3 && (
                              <span className="px-2 py-0.5 bg-gray-500/20 text-gray-300 rounded text-xs">
                                +{news.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-blue-300">
                          <Folder className="w-4 h-4" />
                          {news.categoryName}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-blue-200">
                          <Calendar className="w-4 h-4" />
                          {formatDateShort(news.createdDate)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-blue-200">
                          {news.modifiedDate ? formatDateShort(news.modifiedDate) : '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                          news.newsStatus 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                            : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                        }`}>
                          {news.newsStatus ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {news.newsStatus ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              const basePath = window.location.pathname.includes('/lecturer/') ? '/lecturer/my-news' : '/staff/news';
                              navigate(`${basePath}/${news.newsArticleId}`);
                            }}
                            className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(news)}
                            className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenDeleteDialog(news)}
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

        {/* News Article Form Modal */}
        <NewsArticleFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSubmit={formMode === 'create' ? handleCreateNews : handleUpdateNews}
          newsArticle={selectedNews}
          mode={formMode}
          categories={categories}
          tags={tags}
        />

        {/* Confirm Delete Dialog */}
        <ConfirmDialog
          isOpen={isConfirmDialogOpen}
          onClose={() => setIsConfirmDialogOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Delete News Article"
          message={`Are you sure you want to delete "${selectedNews?.newsTitle}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
        />
      </div>
    </div>
  );
};

export default NewsHistoryPage;
