# Hướng dẫn Test Login Google với Neon DB và Firebase

## Tổng quan hệ thống
- **Frontend**: React Native + Expo (Google Sign-In)
- **Backend**: Spring Boot (xác thực Firebase Token)
- **Database**: Neon PostgreSQL (lưu thông tin user)
- **Authentication**: Firebase Authentication (Google OAuth)

## Luồng hoạt động
```
User → Google Sign-In → Firebase Auth → Backend API → Neon DB
                                     ↓
                              Firebase Firestore (optional)
```

## Bước 1: Chuẩn bị Firebase Service Account

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Chọn project của bạn
3. Project Settings (biểu tượng ⚙️) → Service Accounts
4. Click **"Generate New Private Key"**
5. Download file JSON
6. Đổi tên thành `firebase-service-account.json`
7. Đặt vào thư mục: `backend/src/main/resources/`

## Bước 2: Kiểm tra cấu hình Database

File `application-dev.properties` đã được cập nhật với Neon DB:
```properties
spring.datasource.url=jdbc:postgresql://ep-damp-dust-a1zwfcow-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
spring.datasource.username=neondb_owner
spring.datasource.password=npg_1HpXZgi7tVLh
```

## Bước 3: Khởi động Backend

```bash
cd backend
mvn spring-boot:run
```

Backend sẽ chạy tại: `http://localhost:8080`

**Kiểm tra backend đã sẵn sàng:**
```bash
curl http://localhost:8080/api/auth/health
```

## Bước 4: Chạy Mobile App và Lấy Token

### 4.1. Khởi động mobile app
```bash
cd ..  # ra ngoài backend folder
npx expo start
```

### 4.2. Login bằng Google
- Mở app trên điện thoại/emulator
- Nhấn nút "Google Sign In"
- Đăng nhập bằng tài khoản Google

### 4.3. Xem Firebase ID Token trong console
Sau khi login thành công, bạn sẽ thấy log:
```
========================================
🔑 Firebase ID Token for testing:
eyJhbGciOiJSUzI1NiIsImtpZCI6IjE4M...  (token dài)
========================================
📧 User Email: your-email@gmail.com
👤 Display Name: Your Name
========================================
```

**Copy token này để test API**

## Bước 5: Test API với PowerShell

Chạy script test:
```powershell
cd backend
./test-api.ps1
```

Script sẽ:
1. ✓ Kiểm tra health endpoint
2. ✓ Hỏi bạn nhập Firebase token
3. ✓ Gọi API login
4. ✓ Hiển thị thông tin user và access token
5. ✓ Test lấy thông tin user với access token

## Bước 6: Test API thủ công với curl

```bash
# Test health
curl http://localhost:8080/api/auth/health

# Test login (thay YOUR_TOKEN_HERE bằng token từ bước 4)
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"firebaseIdToken\": \"YOUR_TOKEN_HERE\"}"
```

Response thành công:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "tokenType": "Bearer",
  "expiresIn": 86400,
  "user": {
    "id": 1,
    "firebaseUid": "abc123...",
    "email": "your-email@gmail.com",
    "displayName": "Your Name",
    "photoUrl": "https://...",
    "provider": "google.com"
  }
}
```

## Bước 7: Kiểm tra dữ liệu trong Neon DB

### Option A: Sử dụng psql (nếu đã cài)
```bash
psql 'postgresql://neondb_owner:npg_1HpXZgi7tVLh@ep-damp-dust-a1zwfcow-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require'
```

Sau đó chạy các lệnh SQL:
```sql
-- Xem các bảng
\dt

-- Xem cấu trúc bảng users
\d users

-- Xem tất cả users
SELECT * FROM users;

-- Xem user mới nhất
SELECT id, email, display_name, provider, created_at, last_login 
FROM users 
ORDER BY created_at DESC 
LIMIT 5;
```

### Option B: Sử dụng Neon Console
1. Truy cập https://console.neon.tech/
2. Chọn database của bạn
3. Vào tab **SQL Editor**
4. Chạy query:
```sql
SELECT * FROM users ORDER BY created_at DESC;
```

## Bước 8: Kiểm tra Firebase Console

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Chọn project
3. **Authentication** → **Users**
4. Xem danh sách users đã login

## Checklist hoàn thành

- [ ] Firebase service account key đã được đặt đúng vị trí
- [ ] Backend chạy thành công (port 8080)
- [ ] Mobile app chạy được
- [ ] Login Google thành công trên mobile
- [ ] Đã copy được Firebase ID Token từ console
- [ ] Test API login thành công
- [ ] Nhận được access token và user info
- [ ] Kiểm tra user đã được lưu vào Neon DB
- [ ] Kiểm tra user xuất hiện trong Firebase Console

## Troubleshooting

### Lỗi "Firebase service account key not found"
→ Đảm bảo file `firebase-service-account.json` nằm trong `backend/src/main/resources/`

### Lỗi "Could not connect to database"
→ Kiểm tra Neon DB có đang hoạt động và thông tin kết nối đúng

### Lỗi "Firebase token invalid"
→ Token có thể đã hết hạn (1 giờ), login lại để lấy token mới

### Mobile app không hiện token
→ Kiểm tra console logs trong Metro bundler hoặc Expo Go

### Backend không nhận request từ mobile
→ Kiểm tra CORS settings và IP address trong `cors.allowed-origins`

## File quan trọng

- `backend/src/main/resources/application-dev.properties` - Config DB và Firebase
- `backend/src/main/java/com/seminar/oauth/service/AuthService.java` - Logic login
- `backend/src/main/java/com/seminar/oauth/model/User.java` - User entity
- `hooks/useAuth.tsx` - Frontend login logic
- `backend/test-api.ps1` - Script test API
- `backend/test-db.sql` - SQL queries test

## Next Steps

Sau khi test thành công:
1. Cập nhật CORS để cho phép origin từ mobile app
2. Thêm error handling tốt hơn
3. Implement refresh token
4. Thêm unit tests
5. Deploy lên production
