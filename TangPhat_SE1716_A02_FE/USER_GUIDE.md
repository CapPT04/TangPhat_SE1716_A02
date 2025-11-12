# Hướng dẫn sử dụng FU News Management System

## 🚀 Khởi động dự án

### Backend (API Server)

1. Mở terminal và di chuyển đến thư mục Backend:
```bash
cd FUNewsManagementSystemBE/FUNewsManagementSystem
```

2. Chạy API server:
```bash
dotnet run
```

API sẽ chạy tại: `http://localhost:5000`

### Frontend (React App)

1. Mở terminal mới và di chuyển đến thư mục Frontend:
```bash
cd FUNewsManagementSystemFE
```

2. Chạy dev server (nếu chưa chạy):
```bash
npm run dev
```

App sẽ chạy tại: `http://localhost:3000`

## 📱 Sử dụng ứng dụng

### 1. Trang Login

**URL**: http://localhost:3000/login

**Giao diện**:
- Phần trái: Hero section với logo "FU News" và slogan
- Phần phải: Form đăng nhập với background glass morphism
- Background: Hình ảnh tin tức với hiệu ứng particles

**Đăng nhập**:
1. Nhập email (ví dụ: `admin@funews.com`)
2. Nhập password (ít nhất 6 ký tự)
3. Click nút "Đăng Nhập"
4. Nếu thành công → Chuyển đến trang chủ
5. Nếu thất bại → Hiển thị thông báo lỗi

**Validation**:
- Email không hợp lệ → "Email không hợp lệ"
- Password dưới 6 ký tự → "Mật khẩu phải có ít nhất 6 ký tự"

### 2. Trang chủ (Home)

**URL**: http://localhost:3000/

**Giao diện**:
- Header: Logo, tên user, email, nút logout
- Main content: Welcome message và 3 card tính năng:
  - Quản lý tin tức
  - Quản lý danh mục
  - Quản lý thẻ

**Logout**:
- Click icon logout ở góc phải trên
- Sẽ redirect về trang login

### 3. Protected Routes

Tất cả các trang trừ `/login` đều yêu cầu đăng nhập:
- Nếu chưa login → Tự động redirect về `/login`
- Nếu đã login → Cho phép truy cập

## 🎨 Thiết kế UI

### Màu sắc chủ đạo:
- Primary: Blue (#3b82f6)
- Secondary: Purple (#a855f7)
- Background: Dark gradient (slate-900 → slate-800)
- Text: White, Slate-300

### Hiệu ứng:
- **Glass Morphism**: Form đăng nhập với backdrop blur
- **Animations**: Smooth transitions với Framer Motion
- **Particles**: Floating particles trên background
- **Gradients**: Gradient buttons và highlights

## 🔐 Test Accounts

Bạn cần tạo account trong database hoặc sử dụng account có sẵn từ Backend.

Ví dụ test data (cần tạo trong DB):
```
Email: admin@funews.com
Password: admin123
Role: Admin (1)

Email: staff@funews.com
Password: staff123
Role: Staff (2)
```

## 📝 User Roles

- **Admin (1)**: Full quyền quản lý
- **Staff (2)**: Quản lý tin tức, categories, tags
- **Lecturer (3)**: Xem và tạo tin tức
- **Student (4)**: Chỉ xem tin tức

## 🛠️ Debugging

### Kiểm tra Network Request

1. Mở DevTools (F12)
2. Tab Network
3. Login và xem request đến `/Auth/login`
4. Kiểm tra Response:
   - Success: Status 200, có token
   - Error: Status 400/401, có message

### Kiểm tra LocalStorage

1. Mở DevTools (F12)
2. Tab Application → Local Storage
3. Sau khi login thành công, sẽ thấy:
   - `token`: JWT token
   - `user`: User object (JSON string)

### Kiểm tra Console

Mở Console (F12) để xem:
- Errors (màu đỏ)
- Warnings (màu vàng)
- Logs (màu trắng)

## 🎯 Keyboard Shortcuts

- `Ctrl + Shift + I` (Windows) / `Cmd + Option + I` (Mac): Mở DevTools
- `F12`: Mở DevTools
- `Ctrl + R`: Reload page
- `Ctrl + Shift + R`: Hard reload (clear cache)

## 🌐 Browser Recommendations

Khuyến nghị sử dụng:
- Chrome (latest)
- Edge (latest)
- Firefox (latest)

## ⚡ Performance Tips

1. **Lazy Loading**: Pages được lazy load để tối ưu performance
2. **Code Splitting**: Vite tự động split code
3. **Image Optimization**: Sử dụng CDN images (Unsplash)

## 🔗 URLs Quick Reference

- Login: `http://localhost:3000/login`
- Home: `http://localhost:3000/`
- API Base: `http://localhost:5000/api`
- API Docs: (nếu có Swagger) `http://localhost:5000/swagger`

## 📞 Support

Nếu gặp vấn đề:

1. **Backend không chạy**:
   - Kiểm tra SQL Server đã chạy chưa
   - Kiểm tra connection string
   - Chạy lại `dotnet run`

2. **Frontend không kết nối Backend**:
   - Kiểm tra file `.env` có đúng URL không
   - Kiểm tra Backend có bật CORS không
   - Clear cache và reload

3. **Login lỗi**:
   - Kiểm tra email/password đúng chưa
   - Xem Console có lỗi gì không
   - Xem Network tab để debug API call

## 🎓 Learning Resources

- React: https://react.dev
- TypeScript: https://typescriptlang.org
- Tailwind CSS: https://tailwindcss.com
- Framer Motion: https://framer.com/motion
- React Hook Form: https://react-hook-form.com

---

**Happy Coding! 🚀**
