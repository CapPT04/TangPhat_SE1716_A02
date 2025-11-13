import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AdminLayout from '@/components/layout/AdminLayout';
import StaffLayout from '@/components/layout/StaffLayout';
import LecturerLayout from '@/components/layout/LecturerLayout';

// Lazy load pages
const PublicNewsPage = lazy(() => import('@/pages/PublicNewsPage').then(m => ({ default: m.PublicNewsPage })));
const PublicNewsDetailPage = lazy(() => import('@/pages/PublicNewsDetailPage').then(m => ({ default: m.PublicNewsDetailPage })));
const LoginPage = lazy(() => import('@/pages/LoginPage').then(m => ({ default: m.LoginPage })));
const AccountListPage = lazy(() => import('@/pages/admin/AccountListPage'));
const ReportsPage = lazy(() => import('@/pages/admin/ReportsPage'));

// Staff pages
const CategoryListPage = lazy(() => import('@/pages/staff/CategoryListPage'));
const TagListPage = lazy(() => import('@/pages/staff/TagListPage'));
const NewsArticleListPage = lazy(() => import('@/pages/staff/NewsArticleListPage'));
const NewsDetailPage = lazy(() => import('@/pages/staff/NewsDetailPage'));
const NewsHistoryPage = lazy(() => import('@/pages/staff/NewsHistoryPage'));
const ProfilePage = lazy(() => import('@/pages/staff/ProfilePage'));

// Loading component
const LoadingSpinner = () => (
  <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Admin Route Component - Only for Admin role (role = 3 from appsettings)
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  console.log('🛡️ AdminRoute component rendered');
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  console.log('🛡️ Token:', token ? 'exists' : 'missing');
  console.log('🛡️ UserStr:', userStr);
  
  if (!token) {
    console.log('❌ No token -> redirect /login');
    return <Navigate to="/login" replace />;
  }

  if (userStr && userStr !== 'undefined' && userStr !== 'null') {
    try {
      const user = JSON.parse(userStr);
      console.log('🛡️ User parsed:', user);
      console.log('🛡️ Role check:', user.accountRole, 'Type:', typeof user.accountRole);
      
      // Admin role = 3 (from appsettings.json)
      if (user.accountRole !== 3) {
        console.log('❌ Role !== 3 -> redirect /');
        return <Navigate to="/" replace />;
      }
      
      console.log('✅ Admin verified - rendering children');
    } catch (err) {
      console.error('❌ Parse error:', err);
      return <Navigate to="/login" replace />;
    }
  } else {
    console.log('❌ No valid userStr -> redirect /login');
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Staff Route Component - Only for Staff role (role = 1)
const StaffRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (userStr && userStr !== 'undefined' && userStr !== 'null') {
    try {
      const user = JSON.parse(userStr);
      
      // Staff role = 1
      if (user.accountRole !== 1) {
        return <Navigate to="/" replace />;
      }
    } catch (err) {
      console.error('❌ Parse error:', err);
      return <Navigate to="/login" replace />;
    }
  } else {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Lecturer Route Component - Only for Lecturer role (role = 2)
const LecturerRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (userStr && userStr !== 'undefined' && userStr !== 'null') {
    try {
      const user = JSON.parse(userStr);
      
      // Lecturer role = 2
      if (user.accountRole !== 2) {
        return <Navigate to="/" replace />;
      }
    } catch (err) {
      console.error('❌ Parse error:', err);
      return <Navigate to="/login" replace />;
    }
  } else {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicNewsPage />} />
          <Route path="/news/:id" element={<PublicNewsDetailPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<Navigate to="/admin/accounts" replace />} />
            <Route path="accounts" element={<AccountListPage />} />
            <Route path="reports" element={<ReportsPage />} />
          </Route>

          {/* Staff Routes */}
          <Route
            path="/staff"
            element={
              <StaffRoute>
                <StaffLayout />
              </StaffRoute>
            }
          >
            <Route index element={<Navigate to="/staff/categories" replace />} />
            <Route path="categories" element={<CategoryListPage />} />
            <Route path="tags" element={<TagListPage />} />
            <Route path="news" element={<NewsArticleListPage />} />
            <Route path="news/:id" element={<NewsDetailPage />} />
            <Route path="history" element={<NewsHistoryPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* Lecturer Routes */}
          <Route
            path="/lecturer"
            element={
              <LecturerRoute>
                <LecturerLayout />
              </LecturerRoute>
            }
          >
            <Route index element={<Navigate to="/lecturer/my-news" replace />} />
            <Route path="my-news" element={<NewsHistoryPage />} />
            <Route path="my-news/:id" element={<NewsDetailPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          
          {/* Redirect to home by default */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid rgba(59, 130, 246, 0.2)',
          },
          success: {
            iconTheme: {
              primary: '#3b82f6',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
