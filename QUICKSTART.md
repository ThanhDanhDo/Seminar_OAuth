# ⚡ Quick Start Guide

## 🎯 Mục tiêu
Project này đã hoàn thành **3 yêu cầu**:
1. ✅ Kết nối Neon PostgreSQL cloud database
2. ✅ Lưu thông tin user login vào table `users`
3. ✅ Sử dụng JWT Access Token để authentication

---

## 🚀 Chạy Project (5 bước)

### Bước 1: Setup Backend Database

1. Đăng ký Neon PostgreSQL: https://neon.tech/
2. Tạo project mới → Copy connection string
3. Mở `backend/src/main/resources/application-dev.properties`
4. Thay đổi:
```properties
spring.datasource.url=jdbc:postgresql://YOUR_NEON_HOST/YOUR_DATABASE?sslmode=require
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
```

### Bước 2: Setup Firebase Admin SDK

1. Vào Firebase Console: https://console.firebase.google.com/
2. Project Settings → Service accounts
3. Click "Generate new private key"
4. Lưu file JSON với tên `firebase-service-account.json`
5. Copy vào: `backend/src/main/resources/`

### Bước 3: Start Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Check health: http://localhost:8080/api/auth/health

### Bước 4: Configure Frontend

1. Lấy IP máy tính: `ipconfig` (Windows) hoặc `ifconfig` (Mac/Linux)
2. Mở `src/services/api.ts`
3. Thay đổi:
```typescript
const API_BASE_URL = 'http://YOUR_IP_ADDRESS:8080/api';
```

### Bước 5: Run App

```bash
npm install
npm start
```

Scan QR code hoặc press `a` để run trên Android.

---

## 🧪 Test Integration

1. ✅ Backend running → `curl http://localhost:8080/api/auth/health`
2. ✅ Click "Sign in with Google" trong app
3. ✅ Login thành công → Check console logs
4. ✅ Home screen hiển thị:
   - User info từ Firebase
   - Backend ID
   - Provider
   - Firebase UID
5. ✅ Check database: User đã được tạo trong Neon PostgreSQL

---

## 📊 Kiểm tra Database

Kết nối Neon PostgreSQL:

```bash
psql -h YOUR_HOST -U YOUR_USER -d YOUR_DB
```

Query users:

```sql
SELECT * FROM users;
```

Kết quả:
```
 id | firebase_uid | email | display_name | photo_url | provider | created_at | updated_at | last_login
----+--------------+-------+--------------+-----------+----------+------------+------------+------------
  1 | abc123...    | user@ | John Doe     | https://  | google.  | 2025-01-  | 2025-01-   | 2025-01-
```

---

## 🔍 Debug Logs

### Frontend Console
```
Sending token to backend...
✅ Backend user info loaded: { id: 1, email: "user@gmail.com", ... }
Login successful! Backend user ID: 1
```

### Backend Console
```
Firebase token verified for user: user@gmail.com
Creating new user: user@gmail.com
User saved to database with ID: 1
```

---

## 🎉 Done!

Tất cả 3 yêu cầu đã hoàn thành:
1. ✅ Neon PostgreSQL connected
2. ✅ User info saved to `users` table
3. ✅ JWT Access Token generated & verified

App giờ có thể:
- Login với Google OAuth
- Lưu user vào cloud database
- Authenticate với Bearer token
- Call protected API endpoints
