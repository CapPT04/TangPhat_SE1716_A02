# FU News Management System - Frontend

Hệ thống quản lý tin tức FPT University được xây dựng với React, TypeScript và Tailwind CSS.

## 🚀 Công nghệ sử dụng

- **React 18** - Thư viện UI
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Routing
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Axios** - HTTP client
- **Framer Motion** - Animations
- **React Hot Toast** - Notifications
- **Lucide React** - Icons
- **Zustand** - State management

## 📁 Cấu trúc dự án

```
FUNewsManagementSystemFE/
├── src/
│   ├── components/         # React components
│   │   ├── features/      # Feature-specific components
│   │   │   └── auth/      # Authentication components
│   │   └── layout/        # Layout components
│   ├── pages/             # Page components
│   │   ├── HomePage/      # Home page
│   │   └── LoginPage/     # Login page
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API services
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   └── styles/            # Global styles
├── public/                # Static assets
├── index.html            # HTML entry point
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
├── vite.config.ts        # Vite config
└── tailwind.config.ts    # Tailwind config
```

## 🛠️ Cài đặt

### Yêu cầu

- Node.js >= 18.0.0
- npm hoặc yarn

### Các bước cài đặt

1. **Clone repository**

```bash
cd FUNewsManagementSystemFE
```

2. **Cài đặt dependencies**

```bash
npm install
```

3. **Cấu hình environment variables**

Tạo file `.env` từ file mẫu:

```bash
cp .env.example .env
```

Chỉnh sửa file `.env` với thông tin phù hợp:

```
VITE_API_BASE_URL=http://localhost:5000/api
```

4. **Chạy development server**

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: http://localhost:3000

## 📝 Scripts

- `npm run dev` - Chạy development server
- `npm run build` - Build production
- `npm run preview` - Preview production build
- `npm run lint` - Chạy ESLint
- `npm run lint:fix` - Fix ESLint errors

## 🎨 Thiết kế UI

### Trang Login

Trang login được thiết kế với:
- Background gradient với hiệu ứng particles
- Glass morphism cho form
- Smooth animations với Framer Motion
- Responsive design
- Form validation với React Hook Form & Zod

### Features

- ✅ Authentication (Login/Logout)
- ✅ Protected Routes
- ✅ Form validation
- ✅ Toast notifications
- ✅ Loading states
- ✅ Error handling

## 🔗 API Integration

API base URL được cấu hình trong `.env`:

```typescript
// src/services/api.service.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
```

### API Endpoints

- `POST /Auth/login` - Đăng nhập

## 🎯 Path Aliases

Dự án sử dụng path aliases để import dễ dàng hơn:

```typescript
import { LoginForm } from '@/components/features/auth/LoginForm';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/auth.service';
```

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

ISC

## 👥 Author

FPT University - PRN232 Assignment
