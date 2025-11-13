# 🚀 Full-Stack OAuth App - React Native + Spring Boot# 🔐 Seminar OAuth - Google Sign-In với React Native Expo# Welcome to your Expo app 👋



Ứng dụng Full-Stack với Google OAuth, tích hợp React Native (Frontend) + Spring Boot (Backend) + PostgreSQL/Firestore.



---Ứng dụng React Native Expo tích hợp Google OAuth Authentication sử dụng Firebase Authentication và React Native Google Sign-In.This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).



## 📋 Yêu cầu



### Frontend## 📋 Mục lục## Get started

- Node.js 16+

- Android Studio (để build APK)

- Expo CLI: `npm install -g expo-cli`

- [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)1. Install dependencies

### Backend

- Java 17+- [Cài đặt](#-cài-đặt)

- Maven 3.6+

- Neon PostgreSQL account (hoặc Firestore)- [Cấu hình Firebase](#-cấu-hình-firebase)   ```bash

- Firebase Admin SDK Service Account Key

- [Chạy ứng dụng](#-chạy-ứng-dụng)   npm install

---

- [Build APK Standalone](#-build-apk-standalone)   ```

## 🚀 Cài đặt

- [Cấu trúc thư mục](#-cấu-trúc-thư-mục)

### 1. Frontend Setup

- [Troubleshooting](#-troubleshooting)2. Start the app

```bash

# Install dependencies

npm install

---   ```bash

# Firebase đã được cấu hình (google-services.json)

# Thêm SHA fingerprints vào Firebase Console   npx expo start

```

## 🖥️ Yêu cầu hệ thống   ```

**SHA Fingerprints cần add vào Firebase:**

- Debug: `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25`

- EAS: `88:08:E2:1C:56:4C:B4:B7:5C:F5:C9:18:05:C9:7D:46:49:89:5E:6C`

### Bắt buộc:In the output, you'll find options to open the app in a

### 2. Backend Setup

- **Node.js**: >= 18.x (Khuyến nghị: 20.x LTS)

```bash

cd backend- **npm** hoặc **yarn**- [development build](https://docs.expo.dev/develop/development-builds/introduction/)



# 1. Copy Firebase Service Account Key- **Git**- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)

# Đặt file firebase-service-account.json vào: src/main/resources/

- **Expo CLI**: Sẽ được cài tự động- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)

# 2. Configure application-dev.properties

# Thay đổi Neon PostgreSQL connection string và credentials- **EAS CLI**: Để build APK- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo



# 3. Build và chạy

mvn clean install

mvn spring-boot:run### Tùy chọn (cho build local):You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

```

- **Android Studio**: >= 2024.x với Android SDK

Backend chạy tại: **http://localhost:8080**

- **JDK**: >= 17## Get a fresh project

### 3. Kết nối Frontend với Backend



Mở `src/services/api.ts`, thay đổi IP:

### Tài khoản cần thiết:When you're ready, run:

```typescript

const API_BASE_URL = 'http://YOUR_IP_ADDRESS:8080/api';- **Expo Account**: Đăng ký tại [expo.dev](https://expo.dev)

```

- **Firebase Project**: Tạo tại [Firebase Console](https://console.firebase.google.com)```bash

Lấy IP máy tính:

- Windows: `ipconfig` → IPv4 Addressnpm run reset-project

- Mac/Linux: `ifconfig` → inet

---```

---



## 🎯 Tính năng

## 📦 Cài đặtThis command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

### ✅ Đã hoàn thành 3 yêu cầu



1. **Kết nối Neon PostgreSQL** ✅

   - User table tự động tạo bởi Hibernate### Bước 1: Clone Repository## Learn more

   - Lưu thông tin user khi login

   - Update last login timestamp



2. **Lưu thông tin user vào DB** ✅```bashTo learn more about developing your project with Expo, look at the following resources:

   - Firebase UID (unique)

   - Email, Display Name, Photo URLgit clone <repository-url>

   - Provider (google.com)

   - Created At, Updated At, Last Logincd Seminar_OAuth- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).



3. **Access Token Authentication** ✅```- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

   - JWT token generation

   - Bearer token authentication

   - Protected API endpoints

   - Token auto refresh in frontend### Bước 2: Cài đặt Dependencies## Join the community



### 📝 API Endpoints



**Public:**```bashJoin our community of developers creating universal apps.

```

POST /api/auth/login          # Login với Firebase ID Tokennpm install

GET  /api/auth/health         # Health check

``````- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.



**Protected (cần Bearer Token):**- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

```

GET /api/user/info            # Get user info### Bước 3: Cài đặt EAS CLI (để build APK)

GET /api/user/profile         # Get user profile

``````bash

npm install -g eas-cli

**Example:**```

```bash

curl -X GET http://localhost:8080/api/user/info \---

  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

```## 🔧 Cấu hình Firebase



---### Bước 1: Tạo Firebase Project



## 🔐 Authentication Flow1. Truy cập [Firebase Console](https://console.firebase.google.com)

2. Nhấn **"Add project"** và tạo project mới

```3. Tắt Google Analytics (không bắt buộc)

1. User clicks "Sign in with Google" trong app

2. Google Sign-In dialog mở ra### Bước 2: Thêm Android App

3. User chọn Google account

4. App nhận Firebase ID Token1. Trong Firebase Console, chọn project vừa tạo

5. App gửi Firebase ID Token đến Backend API2. Nhấn biểu tượng **Android** để thêm app

6. Backend verify token với Firebase Admin SDK3. Nhập **Package name**: `com.anonymous.seminaroauth`

7. Backend tạo/update user trong PostgreSQL4. Tải file **`google-services.json`**

8. Backend generate JWT Access Token5. Copy file này vào:

9. Backend trả Access Token về app   - `Seminar_OAuth/google-services.json` (thư mục gốc)

10. App lưu Access Token vào AsyncStorage   - `Seminar_OAuth/android/app/google-services.json`

11. App tự động gửi Bearer Token với mọi API request

12. Backend verify JWT và cho phép truy cập protected endpoints### Bước 3: Enable Google Sign-In

```

1. Trong Firebase Console, vào **Authentication** → **Sign-in method**

---2. Nhấn **Google** → **Enable**

3. Chọn email support và **Save**

## 📱 Development

### Bước 4: Lấy Web Client ID

### Frontend

1. Trong Firebase Console, vào **Project Settings** (⚙️)

```bash2. Chọn tab **"General"** → tìm app Android

npm start          # Start Expo3. Scroll xuống **"Web SDK Configuration"**

npm run android    # Run on Android device4. Copy **Web client ID** (dạng: `xxxx.apps.googleusercontent.com`)

```5. Mở file `hooks/useAuth.tsx` và cập nhật:



### Backend```typescript

GoogleSignin.configure({

```bash  webClientId: 'YOUR_WEB_CLIENT_ID_HERE', // Dán Web Client ID vào đây

cd backend});

mvn spring-boot:run    # Start server on port 8080```

```

### Bước 5: Thêm SHA Fingerprints (Quan trọng!)

### Test Integration

**Lấy SHA fingerprints:**

1. Start backend: `mvn spring-boot:run`

2. Check health: `curl http://localhost:8080/api/auth/health````bash

3. Update IP trong `src/services/api.ts`eas credentials

4. Run app: `npm start````

5. Login → check console logs

6. View user info from backend- Chọn **Android** → **development**

- Copy **SHA-1** và **SHA-256** fingerprints

---

**Thêm vào Firebase:**

## 🏗️ Build APK

1. Trong Firebase Console, vào **Project Settings**

```bash2. Chọn Android app

# Via Gradle (local)3. Scroll xuống **"SHA certificate fingerprints"**

cd android4. Nhấn **"Add fingerprint"** và dán **SHA-1**

.\gradlew assembleRelease5. Nhấn **"Add fingerprint"** lần nữa và dán **SHA-256**

6. **Save**

# APK location:

# android\app\build\outputs\apk\release\app-release.apk> ⚠️ **Lưu ý**: Đợi 5-10 phút sau khi thêm SHA fingerprints trước khi test

```

---

---

## 🚀 Chạy ứng dụng

## 📊 Database Schema (PostgreSQL)

### Development Mode (Cần Metro Server)

```sql

CREATE TABLE users (#### Option 1: Development Build (Khuyến nghị)

    id BIGSERIAL PRIMARY KEY,

    firebase_uid VARCHAR(255) UNIQUE NOT NULL,**Build và cài APK:**

    email VARCHAR(255) NOT NULL,

    display_name VARCHAR(255),```bash

    photo_url TEXT,# Đăng nhập Expo

    provider VARCHAR(50),eas login

    created_at TIMESTAMP,

    updated_at TIMESTAMP,# Build development APK

    last_login TIMESTAMPeas build --profile development --platform android

);```

```

Sau khi build xong:

Table này được Hibernate tự động tạo khi chạy backend lần đầu.1. Quét QR code hoặc mở link để tải APK

2. Cài đặt APK trên thiết bị Android

---3. Chạy dev server:



## 🔄 Alternative: Firestore```bash

npx expo start --dev-client

Nếu muốn dùng Firebase Firestore thay vì PostgreSQL:```



1. Comment PostgreSQL dependencies trong `pom.xml`4. Mở app và quét QR code để kết nối

2. Sử dụng `FirestoreUserService` (đã có sẵn trong code)

3. Update `AuthService` để inject `FirestoreUserService`#### Option 2: Expo Go (Không hỗ trợ Firebase)

4. Firestore collection `users` sẽ được tự động tạo

```bash

---npx expo start

```

## 🐛 Troubleshooting

> ⚠️ **Lưu ý**: Expo Go không hỗ trợ Firebase native modules. Phải dùng Development Build.

### Frontend

---

**DEVELOPER_ERROR khi login**

- Add SHA fingerprints vào Firebase Console## 📱 Build APK Standalone (Không cần Dev Server)

- Settings → Your apps → Add fingerprint

### Phương pháp 1: EAS Build (Khuyến nghị - Đơn giản nhất)

**Module not found**

```bash#### Build Preview APK:

npm install

npx expo prebuild --clean```bash

```eas build --profile preview --platform android

```

**Cannot connect to backend**

- Check backend running: `curl http://localhost:8080/api/auth/health`#### Build Production APK:

- Verify IP address trong `src/services/api.ts`

- Check firewall/network```bash

- Ensure phone và computer cùng WiFi networkeas build --profile production --platform android

```

### Backend

**Sau khi build xong:**

**Port 8080 already in use**- Quét QR code hoặc truy cập link để tải APK

```properties- Cài đặt trực tiếp lên thiết bị Android

# application-dev.properties- App chạy độc lập, không cần dev server

server.port=8081

```---



**Firebase initialization failed**### Phương pháp 2: Build Local với Android Studio

- Check `firebase-service-account.json` trong `src/main/resources/`

- Verify JSON format hợp lệ#### Bước 1: Chuẩn bị

- Download lại từ Firebase Console nếu cần

**Cài đặt Android Studio:**

**Database connection failed**1. Tải Android Studio từ [developer.android.com](https://developer.android.com/studio)

- Kiểm tra Neon connection string2. Cài đặt **Android SDK** (API Level 34 trở lên)

- Verify username/password3. Cài đặt **Android SDK Build-Tools**

- Check network connectivity4. Cài đặt **Android SDK Platform-Tools**

- Test connection: `psql -h YOUR_HOST -U YOUR_USER -d YOUR_DB`

**Thiết lập biến môi trường Windows:**

**JWT token invalid**

- Generate new secret key (xem `application-dev.properties`)1. Mở **System Properties** → **Environment Variables**

- Ensure key is Base64 encoded và >= 256 bits2. Thêm biến mới:

   - **Variable name**: `ANDROID_HOME`

---   - **Variable value**: `C:\Users\YourUsername\AppData\Local\Android\Sdk`



## 📂 Cấu trúc Project3. Thêm vào **PATH**:

   - `%ANDROID_HOME%\platform-tools`

```   - `%ANDROID_HOME%\tools`

Seminar_OAuth/   - `%ANDROID_HOME%\build-tools`

├── app/                      # React Native screens (Expo Router)

│   ├── _layout.tsx          # Root layout with AuthProvider4. Khởi động lại PowerShell/CMD

│   ├── index.tsx            # Redirect logic

│   ├── SignIn.tsx           # Google Sign-In screen#### Bước 2: Generate Native Android Project

│   └── Home.tsx             # User profile + Backend data

├── context/```bash

│   └── AuthContext.tsx      # Global auth state# Tạo thư mục android/ (nếu chưa có)

├── hooks/npx expo prebuild

│   └── useAuth.tsx          # OAuth logic + Backend integration```

├── src/

│   └── services/#### Bước 3: Cấu hình local.properties

│       ├── api.ts           # Axios client with JWT interceptor

│       ├── authApi.ts       # Auth API callsTạo file `android/local.properties`:

│       └── userApi.ts       # User API calls

├── android/                 # Android native code```properties

├── backend/                 # Spring Boot Backendsdk.dir=C:\\Users\\YourUsername\\AppData\\Local\\Android\\Sdk

│   ├── src/```

│   │   └── main/

│   │       ├── java/com/seminar/oauth/> ⚠️ Thay `YourUsername` bằng tên user Windows của bạn

│   │       │   ├── config/             # Security, Firebase config

│   │       │   ├── controller/         # AuthController, UserController**Ví dụ**: Nếu user là `dotha` thì:

│   │       │   ├── dto/                # LoginRequest, LoginResponse, UserInfo```properties

│   │       │   ├── model/              # User entity (JPA)sdk.dir=C:\\Users\\dotha\\AppData\\Local\\Android\\Sdk

│   │       │   ├── repository/         # UserRepository```

│   │       │   ├── security/           # JwtUtil, JwtAuthenticationFilter

│   │       │   ├── service/            # AuthService, UserService, FirestoreUserService#### Bước 4: Build Release APK với Gradle

│   │       │   └── SeminarOAuthApplication.java

│   │       └── resources/**Mở PowerShell/CMD và chạy:**

│   │           ├── application.properties

│   │           ├── application-dev.properties```bash

│   │           └── firebase-service-account.json (add this)cd android

│   ├── pom.xml.\gradlew clean

│   └── .gitignore.\gradlew assembleRelease

├── google-services.json```

├── package.json

├── .env.example**Build sẽ mất 5-10 phút lần đầu tiên.**

├── .gitignore

└── README.mdAPK sẽ được tạo tại:

``````

android/app/build/outputs/apk/release/app-release.apk

---```



## 🛠️ Tech Stack#### Bước 5: Build APK bằng Android Studio (GUI)



### Frontend**Cách 1: Mở project**

- **Framework**: React Native 0.81.5 with Expo SDK 541. Mở **Android Studio**

- **Navigation**: Expo Router 6.0.14 (file-based routing)2. **File** → **Open**

- **Authentication**: @react-native-firebase/auth 23.5.03. Chọn thư mục `Seminar_OAuth/android/`

- **Google Sign-In**: @react-native-google-signin/google-signin 16.0.04. Nhấn **OK**

- **HTTP Client**: Axios

- **Storage**: @react-native-async-storage/async-storage**Cách 2: Sync Gradle**

- **Language**: TypeScript1. Đợi Android Studio index và sync Gradle (3-5 phút)

2. Nếu có lỗi, nhấn **"Try Again"** hoặc **File** → **Sync Project with Gradle Files**

### Backend

- **Framework**: Spring Boot 3.2.0**Cách 3: Build APK**

- **Language**: Java 171. **Build** → **Generate Signed Bundle / APK**

- **Database**: PostgreSQL (Neon) / Firebase Firestore2. Chọn **APK** → **Next**

- **Security**: Spring Security 6.2.03. Chọn **Create new...** (lần đầu) hoặc chọn keystore có sẵn

- **Authentication**: Firebase Admin SDK + JWT (jjwt 0.12.5)   

- **ORM**: Hibernate (Spring Data JPA)   **Tạo Keystore mới:**

- **Build Tool**: Maven 3.9+   - Key store path: Chọn nơi lưu (ví dụ: `my-release-key.keystore`)

- **Utilities**: Lombok (reduce boilerplate code)   - Password: Đặt mật khẩu (nhớ mật khẩu này!)

   - Alias: `my-key-alias`

---   - Password: Đặt mật khẩu cho key

   - Validity: `25` năm

## 📝 Configuration Files   - Certificate: Điền thông tin (có thể để trống)

   

### Frontend4. Nhấn **Next**

5. Chọn **release** build variant

**src/services/api.ts**6. Chọn **V1 (Jar Signature)** và **V2 (Full APK Signature)**

```typescript7. Nhấn **Finish**

const API_BASE_URL = 'http://192.168.1.100:8080/api'; // Change this

```**APK sẽ được tạo tại:**

```

### Backendandroid/app/release/app-release.apk

```

**application-dev.properties**

```propertiesSau khi build xong, Android Studio sẽ hiện popup **"locate"**, nhấn vào để mở thư mục chứa APK.

# Neon PostgreSQL

spring.datasource.url=jdbc:postgresql://YOUR_HOST/YOUR_DB?sslmode=require#### Bước 6: Cài đặt APK lên thiết bị

spring.datasource.username=YOUR_USERNAME

spring.datasource.password=YOUR_PASSWORD**Cách 1: Qua USB**

```bash

# JWTadb install android/app/build/outputs/apk/release/app-release.apk

jwt.secret=YOUR_BASE64_SECRET_KEY```

jwt.expiration=86400000

```**Cách 2: Copy file**

- Copy file `app-release.apk` vào điện thoại

---- Mở File Manager và nhấn vào file APK để cài đặt



## 🧪 Testing---



### 1. Test Backend Health## 📁 Cấu trúc thư mục

```bash

curl http://localhost:8080/api/auth/health```

```Seminar_OAuth/

├── app/                      # Expo Router screens

Expected:│   ├── _layout.tsx          # Root layout với AuthProvider

```json│   ├── index.tsx            # Splash/Loading screen

{│   ├── SignIn.tsx           # Route cho SignIn screen

  "status": "UP",│   └── Home.tsx             # Route cho Home screen

  "message": "Auth service is running"├── screens/                 # Actual screen components

}│   ├── SignIn.tsx           # Google Sign-In UI

```│   └── Home.tsx             # Home screen sau khi đăng nhập

├── context/

### 2. Test Login Flow│   └── AuthContext.tsx      # Auth state management

1. Run backend├── hooks/

2. Run app│   └── useAuth.tsx          # Google Sign-In logic

3. Click "Sign in with Google"├── android/                 # Native Android project

4. Check console logs:│   ├── app/

   - "Sending token to backend..."│   │   ├── google-services.json

   - "Login successful! Backend user ID: X"│   │   ├── build.gradle

5. Home screen hiển thị thông tin từ backend│   │   └── build/

│   │       └── outputs/

### 3. Test Protected Endpoint với Postman│   │           └── apk/

1. Login qua app → copy `accessToken` từ logs│   │               └── release/

2. Open Postman│   │                   └── app-release.apk  # ← APK ở đây

3. GET `http://localhost:8080/api/user/info`│   ├── local.properties     # SDK path (local only)

4. Headers: `Authorization: Bearer YOUR_ACCESS_TOKEN`│   └── build.gradle

5. Should return user info├── google-services.json     # Firebase config (root)

├── GoogleService-Info.plist # Firebase config (iOS)

---├── app.json                 # Expo config

├── eas.json                 # EAS Build config

## 🔐 Security Notes├── package.json

└── README.md               # File này

- JWT secret key phải >= 256 bits (Base64 encoded)```

- Firebase Service Account Key không được commit lên Git

- Access Token có thời hạn 24 giờ (configurable)---

- CORS configured cho development (giới hạn origins trong production)

- PostgreSQL password không được hardcode (use environment variables)## 🔍 Troubleshooting



---### Lỗi: DEVELOPER_ERROR khi Google Sign-In



## 📄 License**Nguyên nhân**: Chưa thêm SHA fingerprints vào Firebase



MIT**Giải pháp**:

1. Chạy `eas credentials` để lấy SHA-1 và SHA-256

---2. Thêm vào Firebase Console → Project Settings → SHA certificate fingerprints

3. Đợi 5-10 phút để Firebase cập nhật

## 👤 Author4. Build lại APK và test



Do Thanh Danh - Full-Stack Development### Lỗi: Native module RNFBAppModule not found



---**Nguyên nhân**: Đang dùng Expo Go (không hỗ trợ Firebase native modules)



## 🙏 Acknowledgments**Giải pháp**: Build Development Build hoặc Standalone APK



- Firebase team for authentication infrastructure### Lỗi: SDK location not found

- Spring Boot community

- React Native & Expo teams**Nguyên nhân**: Chưa cấu hình Android SDK path

- Neon for managed PostgreSQL

**Giải pháp**:
1. Tạo file `android/local.properties`
2. Thêm dòng: `sdk.dir=C:\\Users\\YourUsername\\AppData\\Local\\Android\\Sdk`

### Lỗi: Gradle build failed

**Giải pháp**:
```bash
cd android
.\gradlew clean
.\gradlew assembleRelease
```

### Lỗi: Execution failed for task ':app:mergeReleaseResources'

**Nguyên nhân**: Thiếu file `google-services.json`

**Giải pháp**: Copy file `google-services.json` vào `android/app/`

### Warning: SafeAreaView deprecated

**Giải pháp**: Đã được sửa trong code, dùng `react-native-safe-area-context`

### Lỗi: INSTALL_FAILED_UPDATE_INCOMPATIBLE

**Nguyên nhân**: Đã cài phiên bản app với chữ ký khác

**Giải pháp**:
```bash
adb uninstall com.anonymous.seminaroauth
adb install android/app/build/outputs/apk/release/app-release.apk
```

---

## 📝 Scripts hữu ích

Thêm vào `package.json`:

```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "dev-client": "expo start --dev-client",
    "build:dev": "eas build --profile development --platform android",
    "build:preview": "eas build --profile preview --platform android",
    "build:prod": "eas build --profile production --platform android",
    "build:local": "cd android && .\\gradlew assembleRelease"
  }
}
```

---

## 🛠️ Tech Stack

- **React Native** 0.81.5
- **Expo** 54.x
- **Expo Router** 6.x (File-based routing)
- **Firebase Auth** 23.5.0
- **React Native Firebase** 23.5.0
- **Google Sign-In** 16.0.0
- **TypeScript** 5.9.2

---

## 📊 So sánh phương pháp build

| Phương pháp | Ưu điểm | Nhược điểm | Thời gian |
|-------------|---------|------------|-----------|
| **EAS Build Preview** | ✅ Đơn giản nhất<br>✅ Không cần Android Studio<br>✅ Build trên cloud | ⏱️ Phải chờ queue<br>💰 Giới hạn free tier | 5-15 phút |
| **Android Studio GUI** | ✅ UI trực quan<br>✅ Dễ debug | ❌ Cần cài Android Studio (10GB+)<br>⏱️ Setup lâu | 10-20 phút (lần đầu) |
| **Gradle CLI** | ✅ Nhanh<br>✅ Tự động hóa được | ❌ Cần setup environment | 5-10 phút |

---

## 🎯 Checklist Setup

- [ ] Cài Node.js >= 18
- [ ] Clone repository và `npm install`
- [ ] Cài EAS CLI: `npm install -g eas-cli`
- [ ] Tạo Firebase project
- [ ] Thêm Android app vào Firebase (package: `com.anonymous.seminaroauth`)
- [ ] Tải và copy `google-services.json`
- [ ] Enable Google Sign-In trong Firebase
- [ ] Cập nhật Web Client ID trong `hooks/useAuth.tsx`
- [ ] Đăng nhập EAS: `eas login`
- [ ] Lấy SHA fingerprints: `eas credentials`
- [ ] Thêm SHA-1 và SHA-256 vào Firebase Console
- [ ] Build APK (chọn 1 phương pháp)
- [ ] Test Google Sign-In trên thiết bị thật

---

## 📄 License

MIT License

---

## 👨‍💻 Author

Đỗ Thành Danh - [@thanhdanhdo1701](https://expo.dev/@thanhdanhdo1701)

---

## 🙏 Hỗ trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra [Troubleshooting](#-troubleshooting)
2. Xem [Firebase Documentation](https://rnfirebase.io/)
3. Xem [Expo Documentation](https://docs.expo.dev/)
4. Tạo Issue trên GitHub

---

## 📚 Tài liệu tham khảo

- [Expo Documentation](https://docs.expo.dev/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [React Native Firebase](https://rnfirebase.io/)
- [Google Sign-In](https://react-native-google-signin.github.io/docs/)
- [Firebase Console](https://console.firebase.google.com/)
- [Android Studio](https://developer.android.com/studio)

---

**🎉 Chúc bạn build thành công!**
