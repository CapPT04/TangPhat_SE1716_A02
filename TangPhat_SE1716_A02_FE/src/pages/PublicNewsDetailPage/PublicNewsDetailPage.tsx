import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Newspaper, 
  Calendar, 
  User, 
  Tag as TagIcon, 
  ArrowLeft, 
  Home,
  LogIn,
  Folder
} from 'lucide-react';
import { newsService } from '@/services/news.service';
import { NewsArticle } from '@/types/news.types';
import { toastError } from '@/utils/toast';

const PublicNewsDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  let user: any = null;
  
  if (userStr && userStr !== 'undefined' && userStr !== 'null') {
    try {
      user = JSON.parse(userStr);
    } catch (e) {
      // ignore parse error
    }
  }

  useEffect(() => {
    if (id) {
      loadNewsDetail();
    }
  }, [id]);

  const loadNewsDetail = async () => {
    try {
      setLoading(true);
      // Use the public endpoint
      const data = await newsService.getActiveById(parseInt(id!));
      setNews(data);
    } catch (error: any) {
      toastError(error.response?.data?.message || 'Không thể tải chi tiết tin tức');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const goToDashboard = () => {
    if (user) {
      if (user.accountRole === 3) {
        navigate('/admin/accounts');
      } else if (user.accountRole === 1) {
        navigate('/staff/news');
      } else if (user.accountRole === 2) {
        navigate('/lecturer/my-news');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Newspaper className="w-16 h-16 text-slate-500 mx-auto mb-4" />
          <p className="text-slate-400 text-lg">Không tìm thấy tin tức</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-xl border-b border-white/20 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Newspaper className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">FU News</h1>
                <p className="text-xs text-slate-300">Portal</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden md:inline">Quay lại</span>
              </Link>
              
              {token && user ? (
                <button
                  onClick={goToDashboard}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all"
                >
                  <Home className="w-4 h-4" />
                  <span className="hidden md:inline">Trang quản lý</span>
                </button>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden md:inline">Đăng nhập</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden"
        >
          {/* Article Header */}
          <div className="p-8 border-b border-white/10">
            {/* Category Badge */}
            <div className="mb-4">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-300 text-sm font-medium rounded-full border border-blue-400/30">
                <Folder className="w-4 h-4" />
                {news.categoryName || 'Chưa phân loại'}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
              {news.newsTitle}
            </h1>

            {/* Headline/Subtitle */}
            {news.headline && (
              <p className="text-xl text-slate-300 mb-6 leading-relaxed">
                {news.headline}
              </p>
            )}

            {/* Meta Information */}
            <div className="flex flex-wrap gap-6 text-slate-400">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span className="text-sm">{formatDate(news.createdDate)}</span>
              </div>
              
              {news.createdByName && (
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium">{news.createdByName}</span>
                </div>
              )}

              {news.modifiedDate && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>Cập nhật: {formatDate(news.modifiedDate)}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {news.tags && news.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {news.tags.map((tag) => (
                  <span
                    key={tag.tagId}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-lg border border-purple-400/30"
                  >
                    <TagIcon className="w-3 h-3" />
                    {tag.tagName}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Article Content */}
          <div className="p-8">
            <div 
              className="prose prose-invert prose-lg max-w-none"
              style={{
                color: '#cbd5e1',
              }}
            >
              <div 
                dangerouslySetInnerHTML={{ __html: news.newsContent || '' }}
                className="text-slate-300 leading-relaxed space-y-4"
              />
            </div>

            {/* Source */}
            {news.newsSource && (
              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-sm text-slate-400">
                  <span className="font-medium">Nguồn:</span>{' '}
                  <span className="text-blue-400">{news.newsSource}</span>
                </p>
              </div>
            )}
          </div>
        </motion.article>

        {/* Back Button */}
        <div className="max-w-4xl mx-auto mt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all border border-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại trang tin tức
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/5 backdrop-blur-xl border-t border-white/10 mt-20">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-slate-400 text-sm">
            © 2025 FPT University News Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PublicNewsDetailPage;
