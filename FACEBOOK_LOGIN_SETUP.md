# 🔵 Hướng Dẫn Setup Facebook Login

## 📋 Tổng Quan

Tài liệu này hướng dẫn chi tiết cách thêm Facebook Login vào dự án React Native Expo với Firebase Authentication.

---

## 🎯 BƯỚC 1: Tạo Facebook App

### 1.1. Truy cập Facebook Developers Console

1. Vào https://developers.facebook.com/
2. Đăng nhập tài khoản Facebook của bạn
3. Nhấn **"My Apps"** → **"Create App"**

### 1.2. Chọn Use Case

- Chọn **"Consumer"** (hoặc **"Other"** nếu không có Consumer)
- Nhấn **"Next"**

### 1.3. Điền Thông Tin App

```
App Display Name: Seminar OAuth
App Contact Email: <email của bạn>
App Purpose: Yourself or your own business
```

- Nhấn **"Create App"**
- Hoàn thành Security Check (CAPTCHA)

### 1.4. Add Facebook Login Product

1. Trong Dashboard, scroll xuống tìm **"Facebook Login"**
2. Nhấn **"Set Up"**
3. Chọn platform: **"Android"** (setup trước)

---

## 📱 BƯỚC 2: Cấu Hình Android

### 2.1. Lấy Package Name

Package name của dự án này:
```
com.anonymous.seminaroauth
```

### 2.2. Lấy SHA-1 Key Hash

#### Cách 1: Từ Gradle (Recommended)

```powershell
cd android
./gradlew signingReport
```

**Output mẫu:**
```
Variant: debug
Config: debug
Store: C:\Users\<user>\.android\debug.keystore
Alias: AndroidDebugKey
MD5: A1:B2:C3...
SHA1: 88:08:E2:1C:56:4C:B4:B7:5C:F5:C9:18:05:C9:7D:46:49:89:5E:6C
SHA-256: ...
```

Copy SHA-1: `88:08:E2:1C:56:4C:B4:B7:5C:F5:C9:18:05:C9:7D:46:49:89:5E:6C`

#### Cách 2: Convert SHA-1 sang Facebook Key Hash

Facebook cần format Base64. Có 2 cách:

**Option A: Online Tool**
1. Vào https://tomeko.net/online_tools/hex_to_base64.php
2. Paste SHA-1 (bỏ dấu `:`)
3. Convert → Copy kết quả

**Option B: OpenSSL (nếu đã cài)**
```bash
echo "8808e21c564cb4b75cf5c91805c97d4649895e6c" | xxd -r -p | openssl base64
```

**Key Hash mẫu:** `iAjiHFZMtLdc9ckYBcl9RkmJXmw=`

### 2.3. Cấu Hình Facebook Console

1. Vào **Facebook App Dashboard**
2. Sidebar: **Settings → Basic**
3. Nhấn **"+ Add Platform"**
4. Chọn **"Android"**

Điền thông tin:

```
Google Play Package Name: com.anonymous.seminaroauth
Class Name: .MainActivity
Key Hashes: iAjiHFZMtLdc9ckYBcl9RkmJXmw=
```

5. **Single Sign On**: Bật **YES**
6. Nhấn **"Save Changes"**

### 2.4. Lấy Facebook App ID & App Secret

Vẫn trong **Settings → Basic**:

```
App ID: 123456789012345 (ví dụ - thay bằng ID thật)
App Secret: Click "Show" → Copy
```

⚠️ **LƯU Ý:** Giữ App Secret BÍ MẬT!

---

## 🔥 BƯỚC 3: Cấu Hình Firebase Console

### 3.1. Enable Facebook Authentication

1. Vào https://console.firebase.google.com/
2. Chọn project **"seminar-oauth"**
3. Sidebar: **Build → Authentication**
4. Tab **"Sign-in method"**
5. Tìm **"Facebook"** → Nhấn Edit (icon bút chì)

### 3.2. Nhập Credentials

```
App ID: <Facebook App ID của bạn>
App secret: <Facebook App Secret của bạn>
```

### 3.3. Copy OAuth Redirect URI

Firebase hiển thị một URI dạng:
```
https://seminar-oauth.firebaseapp.com/__/auth/handler
```

**Copy URI này!** (Cần dùng ở bước sau)

### 3.4. Lưu Cấu Hình

Nhấn **"Save"**

---

## 🔗 BƯỚC 4: Cấu Hình Facebook OAuth Settings

### 4.1. Quay lại Facebook Developers

1. Vào Facebook App Dashboard
2. Sidebar: **Facebook Login → Settings**

### 4.2. Add Valid OAuth Redirect URIs

Tìm **"Valid OAuth Redirect URIs"**

Paste URI từ Firebase (bước 3.3):
```
https://seminar-oauth.firebaseapp.com/__/auth/handler
```

### 4.3. Các Settings Khác (Optional nhưng recommended)

```yaml
Client OAuth Login: YES
Web OAuth Login: YES
Enforce HTTPS: YES
Use Strict Mode for Redirect URIs: YES
```

### 4.4. Save Changes

Nhấn **"Save Changes"** ở cuối trang

---

## 📦 BƯỚC 5: Cài Đặt Dependencies

### 5.1. Install Package

```powershell
npm install react-native-fbsdk-next
```

### 5.2. Verify Installation

Kiểm tra `package.json`:
```json
{
  "dependencies": {
    "react-native-fbsdk-next": "^13.0.0"
  }
}
```

---

## ⚙️ BƯỚC 6: Cấu Hình Code

### 6.1. Update `app.json`

Thêm Facebook SDK plugin:

```json
{
  "expo": {
    "plugins": [
      // ... existing plugins
      [
        "react-native-fbsdk-next",
        {
          "appID": "YOUR_FACEBOOK_APP_ID",
          "clientToken": "YOUR_FACEBOOK_CLIENT_TOKEN",
          "displayName": "Seminar OAuth",
          "scheme": "fbYOUR_FACEBOOK_APP_ID",
          "advertiserIDCollectionEnabled": false,
          "autoLogAppEventsEnabled": false,
          "isAutoInitEnabled": true
        }
      ]
    ]
  }
}
```

**⚠️ Thay thế:**
- `YOUR_FACEBOOK_APP_ID` → Facebook App ID của bạn
- `YOUR_FACEBOOK_CLIENT_TOKEN` → Lấy từ Settings → Advanced → Client Token

### 6.2. Đã Update File Code

Các file sau đã được cập nhật tự động:

✅ `hooks/useAuth.tsx` - Thêm `onFacebookSignIn()`
✅ `context/AuthContext.tsx` - Thêm các field mới cho User type
✅ `app/SignIn.tsx` - Thêm nút Facebook Login
✅ `app/Home.tsx` - Hiển thị đầy đủ thông tin user

---

## 🏗️ BƯỚC 7: Build & Test

### 7.1. Prebuild (Regenerate Native Code)

```powershell
npx expo prebuild --clean
```

### 7.2. Build Development APK

```powershell
eas build --profile development --platform android
```

### 7.3. Install & Test

1. Đợi build hoàn tất (~10-15 phút)
2. Download APK từ Expo dashboard
3. Cài đặt lên device Android
4. Test Facebook Login

---

## 🐛 Troubleshooting

### Issue 1: "Invalid Key Hash"

**Lỗi:**
```
Invalid key hash. The key hash ... does not match any stored key hashes.
```

**Nguyên nhân:**
- Key hash trong Facebook Console không đúng

**Giải pháp:**
```powershell
# 1. Lấy lại SHA-1
cd android
./gradlew signingReport

# 2. Convert lại SHA-1 sang Base64
# 3. Update lại trong Facebook Console
# 4. Rebuild app
```

### Issue 2: "App Not Setup"

**Lỗi:**
```
App Not Setup: This app is still in development mode
```

**Nguyên nhân:**
- Facebook App chưa public hoặc thiếu OAuth Redirect URI

**Giải pháp:**
1. Check **Valid OAuth Redirect URIs** trong Facebook Login Settings
2. Thêm Firebase redirect URI
3. Hoặc thêm test users trong **Roles → Test Users**

### Issue 3: Email Permission Not Granted

**Lỗi:**
```
User email not found
```

**Nguyên nhân:**
- User từ chối quyền email

**Giải pháp:**
- Email sẽ là `undefined` → App phải handle gracefully
- Request lại permission nếu cần:
  ```typescript
  await LoginManager.logInWithPermissions(['public_profile', 'email']);
  ```

### Issue 4: Cannot Get Access Token

**Lỗi:**
```
No access token found
```

**Nguyên nhân:**
- User cancel login hoặc lỗi network

**Giải pháp:**
```typescript
const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
if (result.isCancelled) {
  // Handle cancellation
  return;
}
```

---

## 🔐 Facebook Permissions

### Default Permissions (Không cần review)

```typescript
['public_profile', 'email']
```

**Thu thập được:**
- User ID
- Name
- Profile Picture
- Email (nếu có và user cho phép)

### Advanced Permissions (Cần Facebook review)

Nếu cần thêm quyền:
```typescript
[
  'user_birthday',
  'user_friends',
  'user_location',
  // ... etc
]
```

⚠️ **Lưu ý:** Mỗi permission bổ sung cần submit app review từ Facebook!

---

## 📊 Data Flow

```
User tap "Facebook Login"
  ↓
LoginManager.logInWithPermissions()
  ↓
Facebook SDK mở dialog (Native hoặc Browser)
  ↓
User chọn tài khoản + cho phép quyền
  ↓
Facebook trả về Access Token
  ↓
AccessToken.getCurrentAccessToken()
  ↓
Tạo FacebookAuthProvider.credential(token)
  ↓
signInWithCredential(firebase, credential)
  ↓
Firebase verify với Facebook
  ↓
Firebase trả về Firebase User
  ↓
App lưu user info vào Context
  ↓
Navigate to Home screen
```

---

## 🎨 UI Màn Hình Home

Màn hình Home hiện đã hiển thị:

### 📋 Thông Tin Cơ Bản
- Tên hiển thị
- Email
- Trạng thái email xác thực (✅/❌)
- Số điện thoại
- Firebase UID

### ⏰ Thời Gian
- Ngày tạo tài khoản
- Lần đăng nhập cuối

### 🔐 Phương Thức Đăng Nhập
- Provider name (Google / Facebook)
- Provider UID
- Email của provider
- Tên từ provider
- Số điện thoại (nếu có)

---

## 🔄 So Sánh Google vs Facebook Login

| Feature | Google OAuth | Facebook Login |
|---------|--------------|----------------|
| **Email guarantee** | ✅ Luôn có | ⚠️ Có thể null |
| **Email verified** | ✅ Luôn verified | ⚠️ Depends on FB account |
| **Profile picture** | ✅ High quality | ✅ High quality |
| **Setup complexity** | ⭐⭐⭐ | ⭐⭐⭐⭐ (Key hash!) |
| **Testing** | ✅ Easy | ⚠️ Cần add test users |
| **Permissions** | Profile + Email | Profile + Email (optional) |
| **User trust** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## 📝 Checklist

Trước khi test, đảm bảo:

- [ ] Facebook App đã tạo
- [ ] App ID & App Secret đã lưu
- [ ] Package name đúng: `com.anonymous.seminaroauth`
- [ ] SHA-1 key hash đã add vào Facebook
- [ ] OAuth Redirect URI đã add
- [ ] Firebase Authentication enabled Facebook
- [ ] `app.json` đã config plugin
- [ ] Dependencies đã install
- [ ] Code đã update (useAuth, SignIn, Home)
- [ ] Build development APK
- [ ] Test trên device thật

---

## 🎯 Testing

### Test Cases

**1. Login Flow**
- [ ] Tap "Continue with Facebook"
- [ ] Facebook dialog hiện
- [ ] Chọn account
- [ ] Cho phép permissions
- [ ] Redirect về app
- [ ] Navigate to Home
- [ ] Hiển thị user info

**2. User Info Display**
- [ ] Avatar hiển thị
- [ ] Display name đúng
- [ ] Email đúng
- [ ] Provider hiển thị "Facebook"
- [ ] Metadata hiển thị

**3. Logout**
- [ ] Tap "Đăng xuất"
- [ ] Loading indicator
- [ ] Navigate to SignIn
- [ ] Facebook session cleared

**4. Re-login**
- [ ] Login lại không cần nhập password
- [ ] Permissions không hỏi lại

---

## 🚀 Next Steps

### Production Checklist

Khi deploy lên production:

1. **Facebook App Status**
   - Chuyển từ Development → Live
   - Submit App Review (nếu cần extra permissions)
   - Add Privacy Policy URL
   - Add Terms of Service URL

2. **Firebase**
   - Check quota limits
   - Setup monitoring
   - Enable Analytics

3. **Build Production APK**
   ```powershell
   eas build --profile production --platform android
   ```

4. **Upload lên Google Play Store**
   - Update SHA-1 từ release keystore
   - Add release key hash vào Facebook

---

## 📚 Resources

### Documentation
- **Facebook Login for Android**: https://developers.facebook.com/docs/facebook-login/android
- **Firebase Facebook Auth**: https://firebase.google.com/docs/auth/android/facebook-login
- **react-native-fbsdk-next**: https://github.com/thebergamo/react-native-fbsdk-next

### Tools
- **Facebook App Dashboard**: https://developers.facebook.com/apps/
- **Firebase Console**: https://console.firebase.google.com/
- **Hex to Base64 Converter**: https://tomeko.net/online_tools/hex_to_base64.php

---

## 💡 Tips

### Development Tips

1. **Use Test Users**
   - Facebook: Roles → Test Users → Add Test Users
   - Không cần app review cho test users

2. **Debug Key Hash**
   - Mỗi keystore có 1 key hash riêng
   - Development keystore != Release keystore
   - Phải add cả 2 vào Facebook Console

3. **Fallback cho Email**
   ```typescript
   const email = user.email || 'No email provided';
   ```

4. **Handle Errors Gracefully**
   ```typescript
   if (result.isCancelled) {
     // User cancelled - don't show error
     return;
   }
   ```

---

**Chúc bạn setup thành công! 🎉**
