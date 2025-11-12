# FU News Management System - Frontend Setup Guide

## 📋 Tổng quan dự án

Dự án **FU News Management System Frontend** đã được thiết lập thành công với:

### ✅ Công nghệ đã cài đặt

- ✔️ React 18.2.0 + TypeScript
- ✔️ Vite 5.0.8 (Build tool & Dev server)
- ✔️ Tailwind CSS 3.3.6 (Styling)
- ✔️ React Router DOM 6.20.0 (Routing)
- ✔️ React Hook Form 7.48.2 (Form management)
- ✔️ Zod 3.22.4 (Validation)
- ✔️ Axios 1.6.2 (HTTP client)
- ✔️ Framer Motion 12.23.24 (Animations)
- ✔️ React Hot Toast 2.4.1 (Notifications)
- ✔️ Lucide React 0.548.0 (Icons)
- ✔️ Zustand 4.4.7 (State management)

### 📁 Cấu trúc dự án đã tạo

```
FUNewsManagementSystemFE/
├── src/
│   ├── components/
│   │   ├── features/
│   │   │   └── auth/
│   │   │       └── LoginForm.tsx          ✅ Form đăng nhập
│   │   └── layout/
│   │       ├── BackgroundEffects.tsx      ✅ Hiệu ứng background
│   │       └── HeroSection.tsx            ✅ Hero section cho login
│   ├── pages/
│   │   ├── HomePage/
│   │   │   ├── HomePage.tsx               ✅ Trang chủ
│   │   │   └── index.ts
│   │   └── LoginPage/
│   │       ├── LoginPage.tsx              ✅ Trang đăng nhập
│   │       └── index.ts
│   ├── hooks/
│   │   └── useAuth.ts                     ✅ Custom hooks cho auth
│   ├── services/
│   │   ├── api.service.ts                 ✅ API client
│   │   └── auth.service.ts                ✅ Auth service
│   ├── types/
│   │   └── auth.types.ts                  ✅ Type definitions
│   ├── utils/
│   │   ├── constants.ts                   ✅ App constants
│   │   └── helpers.ts                     ✅ Helper functions
│   ├── styles/
│   │   └── globals.css                    ✅ Global CSS + Tailwind
│   ├── App.tsx                            ✅ Main App component
│   ├── main.tsx                           ✅ Entry point
│   └── vite-env.d.ts                      ✅ Type definitions
├── public/                                ✅ Static assets
├── .env                                   ✅ Environment variables
├── .env.example                           ✅ Env template
├── .gitignore                             ✅ Git ignore
├── index.html                             ✅ HTML template
├── package.json                           ✅ Dependencies
├── tsconfig.json                          ✅ TypeScript config
├── tsconfig.node.json                     ✅ TS Node config
├── vite.config.ts                         ✅ Vite config
├── tailwind.config.ts                     ✅ Tailwind config
├── postcss.config.js                      ✅ PostCSS config
└── README.md                              ✅ Documentation
```

## 🎨 Thiết kế Login Page

### Đã implement từ dự án robochemist-react:

✅ **BackgroundEffects Component**
- Gradient background với hình ảnh
- Floating particles animation
- Spotlight effects
- Glass morphism overlay

✅ **HeroSection Component**
- Logo FU News với icon Newspaper
- Slogan và mô tả hệ thống
- Smooth animations với Framer Motion

✅ **LoginForm Component**
- Form validation với React Hook Form + Zod
- Email và Password fields
- Error handling và display
- Loading states
- Glass morphism design
- Smooth animations

### Tính năng đặc biệt:

- 🎭 **Animations**: Sử dụng Framer Motion cho transitions mượt mà
- 🎨 **Glass Morphism**: Backdrop blur và transparency
- 📱 **Responsive**: Hoạt động tốt trên mọi thiết bị
- ⚡ **Form Validation**: Real-time validation với Zod schema
- 🔔 **Toast Notifications**: Thông báo đẹp với react-hot-toast
- 🎯 **Type Safety**: Full TypeScript support

## 🚀 Cách sử dụng

### 1. Development Server (đã chạy)

```bash
npm run dev
```

➡️ Truy cập: http://localhost:3000/

### 2. Build Production

```bash
npm run build
```

### 3. Preview Production Build

```bash
npm run preview
```

### 4. Lint Code

```bash
npm run lint        # Check errors
npm run lint:fix    # Auto fix errors
```

## 🔐 Authentication Flow

### Login Flow:
1. User nhập email và password
2. Form validation với Zod schema
3. Submit request đến API: `POST /Auth/login`
4. Lưu token và user info vào localStorage
5. Redirect đến trang chủ
6. Toast notification thành công

### Protected Routes:
- Tất cả routes trừ `/login` đều được protect
- Kiểm tra token trong localStorage
- Redirect về `/login` nếu chưa đăng nhập

## 🔧 Cấu hình

### Environment Variables (.env)

```bash
VITE_API_BASE_URL=http://localhost:5000/api
```

### Path Aliases (đã config)

```typescript
@/components/* → src/components/*
@/pages/*      → src/pages/*
@/hooks/*      → src/hooks/*
@/services/*   → src/services/*
@/types/*      → src/types/*
@/utils/*      → src/utils/*
@/styles/*     → src/styles/*
```

## 📡 API Integration

### Auth Service (auth.service.ts)

```typescript
// Login
authService.login({ email, password })

// Logout
authService.logout()

// Get stored data
authService.getStoredToken()
authService.getStoredUser()
```

### API Client (api.service.ts)

- Auto attach JWT token to requests
- Handle 401 unauthorized
- Automatic redirect to login on auth failure

## 🎯 Next Steps

### Có thể mở rộng thêm:

1. **News Management**
   - Tạo NewsListPage
   - Tạo NewsDetailPage
   - Tạo CreateNewsPage
   - Tạo EditNewsPage

2. **Categories Management**
   - CategoryListPage
   - CategoryFormPage

3. **Tags Management**
   - TagListPage
   - TagFormPage

4. **User Management** (Admin only)
   - UserListPage
   - UserFormPage

5. **Dashboard**
   - Statistics
   - Charts
   - Recent activities

## 📝 Code Examples

### Tạo một page mới:

```typescript
// src/pages/NewsPage/NewsPage.tsx
import React from 'react';

export const NewsPage: React.FC = () => {
  return (
    <div>
      <h1>News Management</h1>
    </div>
  );
};
```

### Thêm route mới:

```typescript
// src/App.tsx
import { NewsPage } from '@/pages/NewsPage';

<Route 
  path="/news" 
  element={
    <ProtectedRoute>
      <NewsPage />
    </ProtectedRoute>
  } 
/>
```

### Sử dụng API service:

```typescript
import { apiClient } from '@/services/api.service';

// GET request
const news = await apiClient.get('/News');

// POST request
const newNews = await apiClient.post('/News', data);

// PUT request
await apiClient.put(`/News/${id}`, data);

// DELETE request
await apiClient.delete(`/News/${id}`);
```

## 🐛 Troubleshooting

### Port 3000 đã được sử dụng?

Thay đổi port trong `vite.config.ts`:

```typescript
server: {
  port: 3001, // Đổi sang port khác
  open: true,
}
```

### API không kết nối được?

1. Kiểm tra Backend đã chạy chưa
2. Kiểm tra VITE_API_BASE_URL trong .env
3. Kiểm tra CORS settings ở Backend

## ✨ Features Summary

✅ Modern React + TypeScript setup
✅ Beautiful login page design từ robochemist-react
✅ Authentication flow hoàn chỉnh
✅ Protected routes
✅ Form validation
✅ API integration
✅ Toast notifications
✅ Loading states
✅ Error handling
✅ Responsive design
✅ Smooth animations
✅ Type-safe code
✅ Path aliases
✅ Development server running

## 🎉 Kết luận

Dự án **FU News Management System Frontend** đã được setup hoàn chỉnh với:
- Cấu trúc folder chuẩn
- Trang login đẹp mắt từ robochemist-react
- Authentication flow đầy đủ
- API integration sẵn sàng
- Development server đang chạy tại http://localhost:3000/

Bạn có thể bắt đầu phát triển các tính năng tiếp theo! 🚀
