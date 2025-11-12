# 🔐 Seminar OAuth - Google Sign-In với React Native Expo# Welcome to your Expo app 👋



Ứng dụng React Native Expo tích hợp Google OAuth Authentication sử dụng Firebase Authentication và React Native Google Sign-In.This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).



## 📋 Mục lục## Get started



- [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)1. Install dependencies

- [Cài đặt](#-cài-đặt)

- [Cấu hình Firebase](#-cấu-hình-firebase)   ```bash

- [Chạy ứng dụng](#-chạy-ứng-dụng)   npm install

- [Build APK Standalone](#-build-apk-standalone)   ```

- [Cấu trúc thư mục](#-cấu-trúc-thư-mục)

- [Troubleshooting](#-troubleshooting)2. Start the app



---   ```bash

   npx expo start

## 🖥️ Yêu cầu hệ thống   ```



### Bắt buộc:In the output, you'll find options to open the app in a

- **Node.js**: >= 18.x (Khuyến nghị: 20.x LTS)

- **npm** hoặc **yarn**- [development build](https://docs.expo.dev/develop/development-builds/introduction/)

- **Git**- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)

- **Expo CLI**: Sẽ được cài tự động- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)

- **EAS CLI**: Để build APK- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo



### Tùy chọn (cho build local):You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

- **Android Studio**: >= 2024.x với Android SDK

- **JDK**: >= 17## Get a fresh project



### Tài khoản cần thiết:When you're ready, run:

- **Expo Account**: Đăng ký tại [expo.dev](https://expo.dev)

- **Firebase Project**: Tạo tại [Firebase Console](https://console.firebase.google.com)```bash

npm run reset-project

---```



## 📦 Cài đặtThis command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.



### Bước 1: Clone Repository## Learn more



```bashTo learn more about developing your project with Expo, look at the following resources:

git clone <repository-url>

cd Seminar_OAuth- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).

```- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.



### Bước 2: Cài đặt Dependencies## Join the community



```bashJoin our community of developers creating universal apps.

npm install

```- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.

- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

### Bước 3: Cài đặt EAS CLI (để build APK)

```bash
npm install -g eas-cli
```

---

## 🔧 Cấu hình Firebase

### Bước 1: Tạo Firebase Project

1. Truy cập [Firebase Console](https://console.firebase.google.com)
2. Nhấn **"Add project"** và tạo project mới
3. Tắt Google Analytics (không bắt buộc)

### Bước 2: Thêm Android App

1. Trong Firebase Console, chọn project vừa tạo
2. Nhấn biểu tượng **Android** để thêm app
3. Nhập **Package name**: `com.anonymous.seminaroauth`
4. Tải file **`google-services.json`**
5. Copy file này vào:
   - `Seminar_OAuth/google-services.json` (thư mục gốc)
   - `Seminar_OAuth/android/app/google-services.json`

### Bước 3: Enable Google Sign-In

1. Trong Firebase Console, vào **Authentication** → **Sign-in method**
2. Nhấn **Google** → **Enable**
3. Chọn email support và **Save**

### Bước 4: Lấy Web Client ID

1. Trong Firebase Console, vào **Project Settings** (⚙️)
2. Chọn tab **"General"** → tìm app Android
3. Scroll xuống **"Web SDK Configuration"**
4. Copy **Web client ID** (dạng: `xxxx.apps.googleusercontent.com`)
5. Mở file `hooks/useAuth.tsx` và cập nhật:

```typescript
GoogleSignin.configure({
  webClientId: 'YOUR_WEB_CLIENT_ID_HERE', // Dán Web Client ID vào đây
});
```

### Bước 5: Thêm SHA Fingerprints (Quan trọng!)

**Lấy SHA fingerprints:**

```bash
eas credentials
```

- Chọn **Android** → **development**
- Copy **SHA-1** và **SHA-256** fingerprints

**Thêm vào Firebase:**

1. Trong Firebase Console, vào **Project Settings**
2. Chọn Android app
3. Scroll xuống **"SHA certificate fingerprints"**
4. Nhấn **"Add fingerprint"** và dán **SHA-1**
5. Nhấn **"Add fingerprint"** lần nữa và dán **SHA-256**
6. **Save**

> ⚠️ **Lưu ý**: Đợi 5-10 phút sau khi thêm SHA fingerprints trước khi test

---

## 🚀 Chạy ứng dụng

### Development Mode (Cần Metro Server)

#### Option 1: Development Build (Khuyến nghị)

**Build và cài APK:**

```bash
# Đăng nhập Expo
eas login

# Build development APK
eas build --profile development --platform android
```

Sau khi build xong:
1. Quét QR code hoặc mở link để tải APK
2. Cài đặt APK trên thiết bị Android
3. Chạy dev server:

```bash
npx expo start --dev-client
```

4. Mở app và quét QR code để kết nối

#### Option 2: Expo Go (Không hỗ trợ Firebase)

```bash
npx expo start
```

> ⚠️ **Lưu ý**: Expo Go không hỗ trợ Firebase native modules. Phải dùng Development Build.

---

## 📱 Build APK Standalone (Không cần Dev Server)

### Phương pháp 1: EAS Build (Khuyến nghị - Đơn giản nhất)

#### Build Preview APK:

```bash
eas build --profile preview --platform android
```

#### Build Production APK:

```bash
eas build --profile production --platform android
```

**Sau khi build xong:**
- Quét QR code hoặc truy cập link để tải APK
- Cài đặt trực tiếp lên thiết bị Android
- App chạy độc lập, không cần dev server

---

### Phương pháp 2: Build Local với Android Studio

#### Bước 1: Chuẩn bị

**Cài đặt Android Studio:**
1. Tải Android Studio từ [developer.android.com](https://developer.android.com/studio)
2. Cài đặt **Android SDK** (API Level 34 trở lên)
3. Cài đặt **Android SDK Build-Tools**
4. Cài đặt **Android SDK Platform-Tools**

**Thiết lập biến môi trường Windows:**

1. Mở **System Properties** → **Environment Variables**
2. Thêm biến mới:
   - **Variable name**: `ANDROID_HOME`
   - **Variable value**: `C:\Users\YourUsername\AppData\Local\Android\Sdk`

3. Thêm vào **PATH**:
   - `%ANDROID_HOME%\platform-tools`
   - `%ANDROID_HOME%\tools`
   - `%ANDROID_HOME%\build-tools`

4. Khởi động lại PowerShell/CMD

#### Bước 2: Generate Native Android Project

```bash
# Tạo thư mục android/ (nếu chưa có)
npx expo prebuild
```

#### Bước 3: Cấu hình local.properties

Tạo file `android/local.properties`:

```properties
sdk.dir=C:\\Users\\YourUsername\\AppData\\Local\\Android\\Sdk
```

> ⚠️ Thay `YourUsername` bằng tên user Windows của bạn

**Ví dụ**: Nếu user là `dotha` thì:
```properties
sdk.dir=C:\\Users\\dotha\\AppData\\Local\\Android\\Sdk
```

#### Bước 4: Build Release APK với Gradle

**Mở PowerShell/CMD và chạy:**

```bash
cd android
.\gradlew clean
.\gradlew assembleRelease
```

**Build sẽ mất 5-10 phút lần đầu tiên.**

APK sẽ được tạo tại:
```
android/app/build/outputs/apk/release/app-release.apk
```

#### Bước 5: Build APK bằng Android Studio (GUI)

**Cách 1: Mở project**
1. Mở **Android Studio**
2. **File** → **Open**
3. Chọn thư mục `Seminar_OAuth/android/`
4. Nhấn **OK**

**Cách 2: Sync Gradle**
1. Đợi Android Studio index và sync Gradle (3-5 phút)
2. Nếu có lỗi, nhấn **"Try Again"** hoặc **File** → **Sync Project with Gradle Files**

**Cách 3: Build APK**
1. **Build** → **Generate Signed Bundle / APK**
2. Chọn **APK** → **Next**
3. Chọn **Create new...** (lần đầu) hoặc chọn keystore có sẵn
   
   **Tạo Keystore mới:**
   - Key store path: Chọn nơi lưu (ví dụ: `my-release-key.keystore`)
   - Password: Đặt mật khẩu (nhớ mật khẩu này!)
   - Alias: `my-key-alias`
   - Password: Đặt mật khẩu cho key
   - Validity: `25` năm
   - Certificate: Điền thông tin (có thể để trống)
   
4. Nhấn **Next**
5. Chọn **release** build variant
6. Chọn **V1 (Jar Signature)** và **V2 (Full APK Signature)**
7. Nhấn **Finish**

**APK sẽ được tạo tại:**
```
android/app/release/app-release.apk
```

Sau khi build xong, Android Studio sẽ hiện popup **"locate"**, nhấn vào để mở thư mục chứa APK.

#### Bước 6: Cài đặt APK lên thiết bị

**Cách 1: Qua USB**
```bash
adb install android/app/build/outputs/apk/release/app-release.apk
```

**Cách 2: Copy file**
- Copy file `app-release.apk` vào điện thoại
- Mở File Manager và nhấn vào file APK để cài đặt

---

## 📁 Cấu trúc thư mục

```
Seminar_OAuth/
├── app/                      # Expo Router screens
│   ├── _layout.tsx          # Root layout với AuthProvider
│   ├── index.tsx            # Splash/Loading screen
│   ├── SignIn.tsx           # Route cho SignIn screen
│   └── Home.tsx             # Route cho Home screen
├── screens/                 # Actual screen components
│   ├── SignIn.tsx           # Google Sign-In UI
│   └── Home.tsx             # Home screen sau khi đăng nhập
├── context/
│   └── AuthContext.tsx      # Auth state management
├── hooks/
│   └── useAuth.tsx          # Google Sign-In logic
├── android/                 # Native Android project
│   ├── app/
│   │   ├── google-services.json
│   │   ├── build.gradle
│   │   └── build/
│   │       └── outputs/
│   │           └── apk/
│   │               └── release/
│   │                   └── app-release.apk  # ← APK ở đây
│   ├── local.properties     # SDK path (local only)
│   └── build.gradle
├── google-services.json     # Firebase config (root)
├── GoogleService-Info.plist # Firebase config (iOS)
├── app.json                 # Expo config
├── eas.json                 # EAS Build config
├── package.json
└── README.md               # File này
```

---

## 🔍 Troubleshooting

### Lỗi: DEVELOPER_ERROR khi Google Sign-In

**Nguyên nhân**: Chưa thêm SHA fingerprints vào Firebase

**Giải pháp**:
1. Chạy `eas credentials` để lấy SHA-1 và SHA-256
2. Thêm vào Firebase Console → Project Settings → SHA certificate fingerprints
3. Đợi 5-10 phút để Firebase cập nhật
4. Build lại APK và test

### Lỗi: Native module RNFBAppModule not found

**Nguyên nhân**: Đang dùng Expo Go (không hỗ trợ Firebase native modules)

**Giải pháp**: Build Development Build hoặc Standalone APK

### Lỗi: SDK location not found

**Nguyên nhân**: Chưa cấu hình Android SDK path

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
