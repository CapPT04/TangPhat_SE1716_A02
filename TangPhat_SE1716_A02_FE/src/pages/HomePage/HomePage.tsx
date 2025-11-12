import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, LogOut, Users, FileText, Folder, History, User, BarChart3 } from 'lucide-react';
import { useLogout } from '@/hooks/useAuth';
import { motion } from 'framer-motion';

export const HomePage: React.FC = () => {
  const { logout } = useLogout();
  
  // Safe user parsing - memoized to avoid issues
  const user = useMemo(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr || userStr === 'undefined' || userStr === 'null') {
        return {};
      }
      return JSON.parse(userStr);
    } catch {
      return {};
    }
  }, []); // Empty deps - only parse once on mount

  // Determine which cards to show based on role
  // Admin role = 3, Staff role = 1, Lecturer role = 2
  const isAdmin = user.accountRole === 3;
  const isStaff = user.accountRole === 1;
  const isLecturer = user.accountRole === 2;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-xl border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Newspaper className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">FU News</h1>
                <p className="text-xs text-slate-300">Management System</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-white font-medium">{user.accountName || 'User'}</p>
                <p className="text-xs text-slate-300">{user.accountEmail}</p>
              </div>
              <button
                onClick={logout}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                title="Đăng xuất"
              >
                <LogOut className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Chào mừng đến với FU News Management System
          </h2>
          <p className="text-slate-300 text-lg mb-8">
            Hệ thống quản lý tin tức hiện đại cho FPT University
          </p>
          
          {/* Admin Cards */}
          {isAdmin && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Link
                  to="/admin/accounts"
                  className="block bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:border-blue-400/50 transition-all hover:scale-105 group"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Quản lý tài khoản</h3>
                  <p className="text-slate-300 text-sm">
                    Tạo, chỉnh sửa và quản lý tài khoản người dùng
                  </p>
                </Link>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Link
                  to="/admin/reports"
                  className="block bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:border-green-400/50 transition-all hover:scale-105 group"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Báo cáo thống kê</h3>
                  <p className="text-slate-300 text-sm">
                    Xem báo cáo và thống kê hệ thống
                  </p>
                </Link>
              </motion.div>
            </div>
          )}

          {/* Staff Cards */}
          {isStaff && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Link
                  to="/staff/categories"
                  className="block bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-purple-400/50 transition-all hover:scale-105 group"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Folder className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Quản lý danh mục</h3>
                  <p className="text-slate-300 text-sm">
                    Tổ chức tin tức theo danh mục
                  </p>
                </Link>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Link
                  to="/staff/news"
                  className="block bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-blue-400/50 transition-all hover:scale-105 group"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <FileText className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Quản lý tin tức</h3>
                  <p className="text-slate-300 text-sm">
                    Tạo và chỉnh sửa bài viết
                  </p>
                </Link>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Link
                  to="/staff/history"
                  className="block bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-orange-400/50 transition-all hover:scale-105 group"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <History className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Lịch sử bài viết</h3>
                  <p className="text-slate-300 text-sm">
                    Xem tin tức đã tạo
                  </p>
                </Link>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link
                  to="/staff/profile"
                  className="block bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-green-400/50 transition-all hover:scale-105 group"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <User className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Hồ sơ cá nhân</h3>
                  <p className="text-slate-300 text-sm">
                    Cập nhật thông tin
                  </p>
                </Link>
              </motion.div>
            </div>
          )}
          {/* Lecturer Cards */}
          {isLecturer && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Link
                  to="/lecturer/my-news"
                  className="block bg-gradient-to-br from-green-500/20 to-teal-500/20 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:border-green-400/50 transition-all hover:scale-105 group"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Bài viết của tôi</h3>
                  <p className="text-slate-300 text-sm">
                    Quản lý và tạo bài viết
                  </p>
                </Link>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Link
                  to="/lecturer/profile"
                  className="block bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:border-blue-400/50 transition-all hover:scale-105 group"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Hồ sơ cá nhân</h3>
                  <p className="text-slate-300 text-sm">
                    Cập nhật thông tin cá nhân
                  </p>
                </Link>
              </motion.div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
