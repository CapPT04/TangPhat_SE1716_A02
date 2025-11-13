import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Newspaper, Calendar, User, Tag as TagIcon, Search, LogIn, Home, Filter, X } from 'lucide-react';
import { newsService } from '@/services/news.service';
import { categoryService } from '@/services/category.service';
import { NewsArticle } from '@/types/news.types';
import { Category } from '@/types/category.types';
import { toastError } from '@/utils/toast';

const PublicNewsPage = () => {
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoryId, setFilterCategoryId] = useState<number>(0);
  const navigate = useNavigate();
  
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
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [newsData, categoriesData] = await Promise.all([
        newsService.getActive(),
        categoryService.getActive(),
      ]);
      setNewsArticles(newsData);
      setCategories(categoriesData);
    } catch (error: any) {
      toastError(error.response?.data?.message || 'Không thể tải tin tức');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      loadData();
      return;
    }

    try {
      setLoading(true);
      const data = await newsService.search(searchTerm);
      const activeNews = data.filter(item => item.newsStatus);
      setNewsArticles(activeNews);
    } catch (error: any) {
      toastError(error.response?.data?.message || 'Tìm kiếm thất bại');
    } finally {
      setLoading(false);
    }
  };

  const filteredNews = newsArticles.filter(article => {
    if (filterCategoryId > 0 && article.categoryId !== filterCategoryId) {
      return false;
    }
    return true;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
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
              {token && user ? (
                <>
                  <span className="hidden md:block text-sm text-white">
                    Xin chào, <span className="font-semibold">{user.accountName}</span>
                  </span>
                  <button
                    onClick={goToDashboard}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all"
                  >
                    <Home className="w-4 h-4" />
                    <span className="hidden md:inline">Trang quản lý</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  Đăng nhập
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 py-12 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Tin tức FPT University
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-300 text-lg mb-8"
          >
            Cập nhật những tin tức mới nhất từ trường đại học
          </motion.p>

          {/* Search Form */}
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSearch}
            className="max-w-2xl mx-auto"
          >
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm tin tức..."
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all font-medium"
              >
                Tìm kiếm
              </button>
            </div>
          </motion.form>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20"
        >
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-blue-300" />
            <select
              value={filterCategoryId}
              onChange={(e) => setFilterCategoryId(parseInt(e.target.value))}
              className="flex-1 px-4 py-2 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value={0} className="bg-gray-900">Tất cả danh mục</option>
              {categories.map((cat) => (
                <option key={cat.categoryId} value={cat.categoryId} className="bg-gray-900">
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </div>
        </motion.div>
      </section>

      {/* News Grid */}
      <main className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="text-center py-20">
            <Newspaper className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">Không có tin tức nào được tìm thấy</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((article: NewsArticle, index: number) => (
              <motion.div
                key={article.newsArticleId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden hover:border-blue-400/50 transition-all group"
              >
                <div className="p-6">
                  {/* Category Badge */}
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-medium rounded-full border border-blue-400/30">
                      {article.categoryName || 'Chưa phân loại'}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                    {article.newsTitle}
                  </h3>

                  {/* Headline */}
                  <p className="text-slate-300 text-sm mb-4 line-clamp-3">
                    {article.headline}
                  </p>

                  {/* Meta Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(article.createdDate)}</span>
                    </div>
                    
                    {article.createdByName && (
                      <div className="flex items-center gap-2 text-slate-400 text-xs">
                        <User className="w-4 h-4" />
                        <span>{article.createdByName}</span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {article.tags.slice(0, 3).map((tag: any) => (
                        <span
                          key={tag.tagId}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-lg border border-purple-400/30"
                        >
                          <TagIcon className="w-3 h-3" />
                          {tag.tagName}
                        </span>
                      ))}
                      {article.tags.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 bg-slate-500/20 text-slate-300 text-xs rounded-lg">
                          +{article.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Content Preview */}
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-slate-400 text-sm line-clamp-2">
                      {article.newsContent?.replace(/<[^>]*>/g, '')}
                    </p>
                  </div>

                  {/* Read More */}
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <button
                      onClick={() => navigate(`/news/${article.newsArticleId}`)}
                      className="text-blue-400 text-sm font-medium group-hover:text-blue-300 transition-colors"
                    >
                      Đọc thêm →
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
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

export default PublicNewsPage;
