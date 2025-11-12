import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Folder, CheckCircle, XCircle, Tag as TagIcon } from 'lucide-react';
import { NewsArticle } from '@/types/news.types';
import { newsService } from '@/services/news.service';
import { toastError } from '@/utils/toast';

const NewsDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNews();
  }, [id]);

  const loadNews = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const data = await newsService.getById(parseInt(id));
      setNews(data);
    } catch (error: any) {
      toastError(error.response?.data?.message || 'Failed to load news article');
      navigate('/staff/news');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-2xl mb-4">News article not found</p>
          <button
            onClick={() => navigate('/staff/news')}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
          >
            Back to News List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/staff/news')}
          className="mb-6 flex items-center gap-2 text-blue-300 hover:text-blue-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to News List
        </motion.button>

        {/* News Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden"
        >
          {/* Header Section */}
          <div className="p-8 border-b border-white/10">
            <div className="flex items-center justify-between mb-4">
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                news.newsStatus 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
              }`}>
                {news.newsStatus ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Published
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    Draft
                  </>
                )}
              </span>
              <span className="text-blue-300 text-sm font-mono">
                ID: {news.newsArticleId}
              </span>
            </div>

            <h1 className="text-4xl font-bold text-white mb-4">
              {news.newsTitle}
            </h1>

            {news.headline && (
              <p className="text-xl text-blue-200 mb-6 italic">
                {news.headline}
              </p>
            )}

            {/* Meta Information */}
            <div className="flex flex-wrap gap-6 text-blue-200">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span>{news.createdByName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{formatDate(news.createdDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Folder className="w-5 h-5" />
                <span>{news.categoryName}</span>
              </div>
            </div>

            {/* Tags */}
            {news.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {news.tags.map((tag) => (
                  <span
                    key={tag.tagId}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-sm border border-blue-500/30"
                  >
                    <TagIcon className="w-3 h-3" />
                    {tag.tagName}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-8">
            <div 
              className="prose prose-invert prose-lg max-w-none text-gray-200"
              dangerouslySetInnerHTML={{ __html: news.newsContent }}
            />
          </div>

          {/* Modified Date */}
          {news.modifiedDate && (
            <div className="px-8 py-4 bg-white/5 border-t border-white/10 text-sm text-blue-300">
              Last modified: {formatDate(news.modifiedDate)}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default NewsDetailPage;
