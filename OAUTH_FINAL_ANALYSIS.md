# 📋 Phân Tích Chi Tiết OAuth & Token trong Dự Án React Native Expo (Final Version)

## 📌 Tổng Quan Dự Án

Dự án React Native Expo này triển khai **OAuth 2.0 Authentication** với **2 providers**:
- ✅ **Google Sign-In** (sử dụng ID Token)
- ✅ **Facebook Login** (sử dụng Access Token)

Cả 2 đều tích hợp với **Firebase Authentication** làm backend xác thực trung tâm.

---

## 1. 🔍 OAuth Sử Dụng Từ Bên Đâu?

### A. Google OAuth 2.0

#### 1. **React Native Google Sign-In** (`@react-native-google-signin/google-signin`)
```typescript
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: '420441521685-18fm24pud4pq3ge16nk69e689a2p5ta1.apps.googleusercontent.com',
});
```

**Vai trò:**
- Hiển thị **Google Sign-In UI native** (bottom sheet trên Android/iOS)
- Tương tác trực tiếp với **Google Identity Services**
- Trả về **ID Token** (JWT) sau khi user đăng nhập thành công
- Xử lý **OAuth 2.0 Authorization Code Flow** ở native layer

**Flow hoạt động:**
```
User nhấn button 
  → GoogleSignin.signIn() 
  → Mở Google Account Chooser (native UI)
  → User chọn account & đồng ý quyền
  → Google trả về Authorization Code
  → SDK exchange code → ID Token
  → App nhận được signInResult.data.idToken
```

#### 2. **React Native Firebase Auth** (`@react-native-firebase/auth`)
```typescript
import auth, { 
  GoogleAuthProvider,
  signInWithCredential 
} from '@react-native-firebase/auth';

const googleCredential = GoogleAuthProvider.credential(idToken);
await signInWithCredential(authInstance, googleCredential);
```

**Vai trò:**
- Backend authentication service (Firebase Auth)
- Validate ID Token với Google
- Tạo Firebase User Session
- Quản lý auth state persistence

#### 3. **Google OAuth 2.0 Server**
- **Endpoint Authorization**: `https://accounts.google.com/o/oauth2/v2/auth`
- **Token Endpoint**: `https://oauth2.googleapis.com/token`
- **UserInfo Endpoint**: `https://www.googleapis.com/oauth2/v3/userinfo`

---

### B. Facebook OAuth 2.0

#### 1. **React Native FBSDK Next** (`react-native-fbsdk-next`)
```typescript
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';

// Yêu cầu quyền
const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

// Lấy Access Token
const data = await AccessToken.getCurrentAccessToken();
```

**Vai trò:**
- Hiển thị **Facebook Login Dialog** (native)
- Tương tác với **Facebook Graph API**
- Trả về **Access Token** (không phải ID Token!)
- Quản lý Facebook App permissions

**Flow hoạt động:**
```
User nhấn Facebook button
  → LoginManager.logInWithPermissions()
  → Mở Facebook App hoặc WebView
  → User đăng nhập & đồng ý quyền
  → Facebook trả về Access Token
  → App lưu token vào secure storage
```

#### 2. **Firebase Auth với Facebook Provider**
```typescript
import { FacebookAuthProvider } from '@react-native-firebase/auth';

const facebookCredential = FacebookAuthProvider.credential(data.accessToken);
await signInWithCredential(authInstance, facebookCredential);
```

**Vai trò:**
- Convert Facebook Access Token → Firebase Credential
- Validate token với Facebook Graph API
- Tạo hoặc link Firebase User

---

## 2. 🎫 Sự Khác Biệt Giữa ID Token và Access Token

### A. ID Token (Google sử dụng)

#### Định nghĩa
**ID Token** là một **JWT (JSON Web Token)** tuân theo chuẩn **OpenID Connect (OIDC)**.

#### Cấu trúc JWT
```
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI0MjA0NDE1MjE2ODUuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI0MjA0NDE1MjE2ODUuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTc5NzU4ODg3NjUyMzQ1Njc4OTAiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6IkpvaG4gRG9lIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hLS9BT2gxNEdnNC1rVmNIZyIsImdpdmVuX25hbWUiOiJKb2huIiwiZmFtaWx5X25hbWUiOiJEb2UiLCJpYXQiOjE3MzI4NDMyMDAsImV4cCI6MTczMjg0NjgwMH0.signature
```

#### Decoded Payload (JSON)
```json
{
  "iss": "https://accounts.google.com",
  "azp": "420441521685.apps.googleusercontent.com",
  "aud": "420441521685.apps.googleusercontent.com",
  "sub": "117975887652345678901",
  "email": "user@example.com",
  "email_verified": true,
  "name": "John Doe",
  "picture": "https://lh3.googleusercontent.com/a-/AOh14Gg4-kVcHg",
  "given_name": "John",
  "family_name": "Doe",
  "iat": 1732843200,
  "exp": 1732846800
}
```

#### Claims (Các trường) trong ID Token

| Claim | Mô tả | Ví dụ |
|-------|-------|-------|
| `iss` | Issuer - Nhà phát hành token | `https://accounts.google.com` |
| `sub` | Subject - ID duy nhất của user tại Google | `117975887652345678901` |
| `aud` | Audience - Client ID của app | `420441521685...` |
| `exp` | Expiration - Thời gian hết hạn (Unix timestamp) | `1732846800` (1 giờ) |
| `iat` | Issued At - Thời gian phát hành | `1732843200` |
| `email` | Email của user | `user@example.com` |
| `email_verified` | Email đã xác thực chưa | `true` |
| `name` | Tên đầy đủ | `John Doe` |
| `picture` | URL ảnh đại diện | `https://...` |
| `given_name` | Tên | `John` |
| `family_name` | Họ | `Doe` |

#### Mục đích sử dụng
- ✅ **Xác thực danh tính** (Authentication)
- ✅ **Lấy thông tin cơ bản** của user (email, tên, ảnh)
- ❌ **KHÔNG dùng để gọi API** (không có quyền truy cập tài nguyên)
- ✅ **Single Sign-On (SSO)**

#### Thời gian sống
- Thường: **1 giờ** (3600 seconds)
- Không thể làm mới (không có refresh token kèm theo mặc định)

#### Verify ID Token
```typescript
// Firebase tự động verify khi gọi signInWithCredential
const googleCredential = GoogleAuthProvider.credential(idToken);
await signInWithCredential(authInstance, googleCredential);

// Manual verify (nếu cần)
import { OAuth2Client } from 'google-auth-library';
const client = new OAuth2Client(CLIENT_ID);
const ticket = await client.verifyIdToken({
    idToken: idToken,
    audience: CLIENT_ID,
});
const payload = ticket.getPayload();
```

#### Ví dụ trong code
```typescript
const signInResult = await GoogleSignin.signIn();
const idToken = signInResult.data?.idToken;

console.log(idToken); 
// Output: eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOi...

// Decode để xem (không cần gọi API)
import jwtDecode from 'jwt-decode';
const decoded = jwtDecode(idToken);
console.log(decoded.email); // user@example.com
```

---

### B. Access Token (Facebook sử dụng)

#### Định nghĩa
**Access Token** là một **opaque token** (chuỗi random, không có cấu trúc JSON).

#### Cấu trúc
```
EAAQZBfBVPMW0BO2mKjZC6EEMuMg8yqZBcj4u9pjBZCKHgUxqN8eLV1nZBo0FjHg9wQTx8PwZCVZAZBZCnGHZBSa9vZAPZBr2iYZBU5RJZBwxQZBkE1vtZBK9ZCQpZBWZCTZBYZBuM9rZCwZBZAYZBxq
```
- Không phải JWT
- Không thể decode
- Chỉ Facebook hiểu ý nghĩa

#### Mục đích sử dụng
- ✅ **Gọi Facebook Graph API**
- ✅ **Truy cập tài nguyên người dùng** (posts, friends, photos)
- ✅ **Thực hiện actions** (đăng status, comment)
- ❌ **KHÔNG chứa thông tin user** (phải gọi API để lấy)

#### Permissions (Quyền)
```typescript
await LoginManager.logInWithPermissions([
  'public_profile', // ✅ Tên, ảnh, ID
  'email',          // ✅ Email
  'user_friends',   // ⚠️ Danh sách bạn bè (cần approval)
  'user_posts',     // ⚠️ Xem posts (cần approval)
]);
```

| Permission | Mô tả | Cần Review? |
|------------|-------|-------------|
| `public_profile` | Tên, ảnh, giới tính, độ tuổi | ❌ Không |
| `email` | Địa chỉ email | ❌ Không |
| `user_friends` | Danh sách bạn bè | ✅ Cần |
| `user_posts` | Xem bài đăng | ✅ Cần |
| `publish_actions` | Đăng bài thay user | ✅ Cần |

#### Lấy thông tin user
```typescript
const accessToken = data.accessToken;

// Gọi Graph API
const response = await fetch(
  `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`
);
const userInfo = await response.json();

console.log(userInfo);
// {
//   "id": "1234567890",
//   "name": "John Doe",
//   "email": "john@example.com",
//   "picture": {
//     "data": {
//       "url": "https://platform-lookaside.fbsbx.com/platform/profilepic/?..."
//     }
//   }
// }
```

#### Thời gian sống
- **Short-lived token**: 1-2 giờ (mặc định)
- **Long-lived token**: 60 ngày (cần exchange)
- **User Access Token**: Hết hạn khi user đổi mật khẩu hoặc revoke

#### Exchange Short-lived → Long-lived
```typescript
const response = await fetch(
  `https://graph.facebook.com/v18.0/oauth/access_token?` +
  `grant_type=fb_exchange_token&` +
  `client_id=${APP_ID}&` +
  `client_secret=${APP_SECRET}&` +
  `fb_exchange_token=${shortLivedToken}`
);
const { access_token } = await response.json();
```

---

### C. So Sánh ID Token vs Access Token

| Tiêu chí | ID Token (Google) | Access Token (Facebook) |
|----------|-------------------|-------------------------|
| **Format** | JWT (JSON Web Token) | Opaque String |
| **Có thể decode?** | ✅ Có (base64) | ❌ Không |
| **Chứa thông tin user?** | ✅ Có (email, name, photo) | ❌ Không (phải gọi API) |
| **Mục đích chính** | **Authentication** (xác thực) | **Authorization** (ủy quyền) |
| **Gọi API?** | ❌ Không (chỉ verify danh tính) | ✅ Có (Graph API) |
| **Thời gian sống** | 1 giờ | 1-2 giờ (short) / 60 ngày (long) |
| **Làm mới?** | ❌ Không (phải đăng nhập lại) | ✅ Có (dùng refresh token hoặc exchange) |
| **Verify** | Dùng public key của Google | Gọi `/debug_token` API |
| **Chuẩn** | OpenID Connect (OIDC) | OAuth 2.0 thuần |

---

## 3. 🔐 Có Lưu Trữ Mật Khẩu Người Dùng Không?

**KHÔNG** - Đây là ưu điểm lớn nhất của OAuth 2.0!

### Điều app này KHÔNG bao giờ thấy:
- ❌ Mật khẩu Google của user
- ❌ Mật khẩu Facebook của user
- ❌ User nhập mật khẩu trong app
- ❌ Mật khẩu được gửi qua network của app

### Flow nhập mật khẩu thực tế:

#### Google Sign-In:
```
1. User nhấn "Sign in with Google"
2. App gọi GoogleSignin.signIn()
3. Mở Google Account Chooser (UI của Google, không phải app)
4. User nhập mật khẩu VÀO TRANG GOOGLE
5. Google xác thực → trả ID Token cho app
6. App chỉ nhận ID Token (không thấy mật khẩu)
```

#### Facebook Login:
```
1. User nhấn "Sign in with Facebook"
2. App gọi LoginManager.logInWithPermissions()
3. Mở Facebook App hoặc WebView (UI của Facebook)
4. User nhập mật khẩu VÀO FACEBOOK
5. Facebook xác thực → trả Access Token cho app
6. App chỉ nhận Access Token (không thấy mật khẩu)
```

### Điều app này lưu trữ:

#### 1. **Trong RAM (React State)**
```typescript
// context/AuthContext.tsx
export type User = {
  displayName?: string;
  email?: string;
  photoURL?: string;
  uid: string;
  phoneNumber?: string;
  emailVerified?: boolean;
  providerData?: Array<{
    providerId: string; // "google.com" hoặc "facebook.com"
    uid: string;
    displayName?: string;
    email?: string;
    photoURL?: string;
    phoneNumber?: string;
  }>;
  metadata?: {
    creationTime?: string;
    lastSignInTime?: string;
  };
};

const [user, setUser] = useState<User>(); // Mất khi đóng app
```

#### 2. **Firebase Auth Session (Secure Storage)**
Firebase SDK tự động lưu:
- **iOS**: Keychain (encrypted)
- **Android**: EncryptedSharedPreferences (encrypted)
- **Nội dung**: Session token, refresh token (nếu có)

#### 3. **Không lưu credentials**
- ❌ Không lưu ID Token
- ❌ Không lưu Access Token
- ❌ Không lưu mật khẩu
- ✅ Chỉ lưu Firebase Session (Firebase SDK quản lý)

---

## 4. 🔄 Account Linking (Liên Kết Tài Khoản)

### Vấn đề
User đã đăng ký bằng **Google** với email `user@example.com`, sau đó thử đăng nhập bằng **Facebook** với cùng email → Firebase báo lỗi:
```
auth/account-exists-with-different-credential
```

### Giải pháp (Code thực tế)

```typescript
async function onFacebookSignIn() {
  try {
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
    const data = await AccessToken.getCurrentAccessToken();
    const facebookCredential = FacebookAuthProvider.credential(data.accessToken);
    
    try {
      // Thử đăng nhập trực tiếp
      const userCredential = await signInWithCredential(authInstance, facebookCredential);
      setUser(userCredential.user);
    } catch (error: any) {
      if (error?.code === 'auth/account-exists-with-different-credential') {
        // Lấy email từ error hoặc Facebook Graph API
        let email = error?.email;
        if (!email) {
          const profile = await fetch(
            `https://graph.facebook.com/me?fields=email&access_token=${data.accessToken}`
          );
          const profileData = await profile.json();
          email = profileData.email;
        }
        
        // Hiện Alert hỏi user
        Alert.alert(
          'Tài khoản đã tồn tại',
          `Email ${email} đã được đăng ký bằng Google. Bạn có muốn liên kết Facebook không?`,
          [
            { text: 'Hủy', style: 'cancel' },
            {
              text: 'Liên kết',
              onPress: async () => {
                // Tự động đăng nhập Google (silent)
                await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
                const signInResult = await GoogleSignin.signIn();
                const idToken = signInResult.data?.idToken;
                
                const googleCredential = GoogleAuthProvider.credential(idToken);
                const userCredential = await signInWithCredential(authInstance, googleCredential);
                
                // Link Facebook credential
                await linkWithCredential(userCredential.user, facebookCredential);
                
                // Đăng nhập lại với Facebook
                const finalUser = await signInWithCredential(authInstance, facebookCredential);
                setUser(finalUser.user);
                
                Alert.alert('Thành công', 'Đã liên kết và đăng nhập thành công!');
              }
            }
          ]
        );
      }
    }
  } catch (error) {
    console.error('Facebook Sign-In error:', error);
    throw error;
  }
}
```

### Flow hoạt động:
```
1. User nhấn "Sign in with Facebook"
2. Firebase phát hiện email đã tồn tại với Google
3. App lấy email từ Facebook Graph API
4. Hiện Alert: "Email đã dùng Google, muốn link không?"
5. User chọn "Liên kết"
6. App tự động:
   - Đăng nhập Google (silent)
   - Link Facebook credential vào account Google
   - Đăng nhập lại với Facebook
   - Chuyển user vào Home screen
7. Giờ user có 2 providers: Google + Facebook
```

### Kết quả trong Firebase
```typescript
user.providerData = [
  {
    providerId: "google.com",
    uid: "117975887652345678901",
    email: "user@example.com",
    displayName: "John Doe",
    photoURL: "https://lh3.googleusercontent.com/...",
  },
  {
    providerId: "facebook.com",
    uid: "1234567890",
    email: "user@example.com",
    displayName: "John Doe",
    photoURL: "https://platform-lookaside.fbsbx.com/...",
  }
];
```

---

## 5. 🎨 UI/UX - Loading States & Button Design

### Dual Loading Indicators

#### Before (1 loading cho cả 2 button):
```typescript
const [loading, setLoading] = useState(false);

// ❌ Cả 2 button cùng disabled khi loading
<GoogleSigninButton disabled={loading} />
<FacebookButton disabled={loading} />
```

#### After (Riêng biệt):
```typescript
const [loadingGoogle, setLoadingGoogle] = useState(false);
const [loadingFacebook, setLoadingFacebook] = useState(false);

// ✅ Mỗi button có loading riêng
{loadingGoogle ? (
  <View style={styles.loadingButton}>
    <ActivityIndicator size="small" color="#4285F4" />
  </View>
) : (
  <GoogleSigninButton disabled={loadingGoogle || loadingFacebook} />
)}

{loadingFacebook ? (
  <View style={styles.loadingButton}>
    <ActivityIndicator size="small" color="#1877F2" />
  </View>
) : (
  <FacebookButton disabled={loadingGoogle || loadingFacebook} />
)}
```

### Facebook Button Design (giống Google)

#### Kích thước:
```typescript
// GoogleSigninButton.Size.Wide = 312x48px
facebookButton: {
  width: 312,  // ✅ Giống Google
  height: 48,  // ✅ Giống Google
  backgroundColor: '#1877F2',
  borderRadius: 4,
}
```

#### Icon design:
```typescript
<TouchableOpacity style={styles.facebookButton}>
  <View style={styles.facebookButtonContent}>
    {/* Icon "f" trong box trắng */}
    <View style={styles.iconContainer}>
      <Text style={styles.facebookIcon}>f</Text>
    </View>
    <Text style={styles.facebookButtonText}>
      Sign in with Facebook
    </Text>
  </View>
</TouchableOpacity>
```

---

## 6. 🔒 Security Best Practices

### A. Token Storage
- ✅ **ID Token**: Không lưu (chỉ dùng 1 lần để tạo Firebase session)
- ✅ **Access Token**: Không lưu trong app (Facebook SDK tự quản lý)
- ✅ **Firebase Session**: Tự động encrypted bởi SDK
- ❌ **AsyncStorage**: KHÔNG dùng để lưu token (không an toàn)

### B. Token Validation
```typescript
// Firebase tự động validate
const credential = GoogleAuthProvider.credential(idToken);
await signInWithCredential(authInstance, credential);
// ↑ Firebase verify với Google trước khi tạo session
```

### C. HTTPS Only
- ✅ Tất cả API calls dùng HTTPS
- ✅ Firebase OAuth Redirect URI: `https://seminar-oauth.firebaseapp.com/__/auth/handler`

### D. Client Secret
```json
// app.json
{
  "appID": "1185127116280087",
  "clientToken": "5b1b069a14ba4f12b42cca4b13e1ceac"
}
```
⚠️ **LƯU Ý**: 
- Client Token có thể public (dùng cho client-side)
- App Secret PHẢI BÍ MẬT (không commit vào Git)
- Dùng `.env` file và `.gitignore`

---

## 7. 🚀 Deployment Checklist

### Firebase Console
- ✅ Enable Google Sign-In
- ✅ Enable Facebook Sign-In
- ✅ Add SHA-1 certificate fingerprint
- ✅ Download `google-services.json` (Android)
- ✅ Download `GoogleService-Info.plist` (iOS)

### Facebook Developers
- ✅ Create Facebook App
- ✅ Add Android platform
- ✅ Configure Package Name: `com.anonymous.seminaroauth`
- ✅ Add Key Hash: `iAjiHFZMtLdc9ckYBcl9RkmJXmw=`
- ✅ Add OAuth Redirect URI: `https://seminar-oauth.firebaseapp.com/__/auth/handler`
- ✅ Enable Single Sign On
- ✅ Set App to "Live" mode (sau khi test xong)

### EAS Build
```powershell
# Build APK
eas build --profile production --platform android

# Download SHA-1
eas credentials
```

---

## 8. 🧪 Testing Flow

### Test Case 1: Google Sign-In
```
1. Mở app → Nhấn "Sign in with Google"
2. Chọn account Google
3. Kiểm tra: Chuyển vào Home screen
4. Kiểm tra: Hiển thị đúng tên, email, ảnh
5. Kiểm tra: providerData có "google.com"
```

### Test Case 2: Facebook Sign-In (chưa có account)
```
1. Đăng xuất (nếu đã login)
2. Nhấn "Sign in with Facebook"
3. Đăng nhập Facebook
4. Kiểm tra: Chuyển vào Home
5. Kiểm tra: providerData có "facebook.com"
```

### Test Case 3: Account Linking
```
1. Đăng nhập Google trước với email X
2. Đăng xuất
3. Nhấn "Sign in with Facebook" với cùng email X
4. Kiểm tra: Hiện Alert "Tài khoản đã tồn tại"
5. Nhấn "Liên kết"
6. Kiểm tra: Tự động login Google (silent)
7. Kiểm tra: Hiện Alert "Đã liên kết thành công"
8. Kiểm tra: Home screen hiển thị 2 providers
```

### Test Case 4: Dual Loading
```
1. Nhấn Google button
2. Kiểm tra: Google button thành loading spinner
3. Kiểm tra: Facebook button bị disabled
4. Sau khi login xong:
5. Kiểm tra: Cả 2 button active trở lại
```

---

## 9. 📊 Token Lifecycle

### Google ID Token
```
┌─────────────┐
│ User Login  │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ Google Sign-In  │ ← Nhập mật khẩu vào trang Google
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ ID Token (JWT)  │ ← Thời gian sống: 1 giờ
│ eyJhbGci...     │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Firebase Auth   │ ← Verify token với Google
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Firebase Session│ ← Lưu trong Keychain/Keystore
│ (encrypted)     │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ App State       │ ← setUser() trong React State
│ (RAM)           │
└─────────────────┘
```

### Facebook Access Token
```
┌─────────────┐
│ User Login  │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│ Facebook Login      │ ← Nhập mật khẩu vào Facebook
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Access Token        │ ← Thời gian sống: 1-2 giờ
│ EAAQZBfBVPMW0BO... │
└──────┬──────────────┘
       │
       ├──────────────────────┐
       │                      │
       ▼                      ▼
┌────────────────┐   ┌────────────────┐
│ Graph API Call │   │ Firebase Auth  │
│ /me?fields=... │   │ Verify + Create│
└────────────────┘   └────────┬───────┘
                              │
                              ▼
                     ┌─────────────────┐
                     │ Firebase Session│
                     └─────────────────┘
```

---

## 10. 📝 Code Structure Summary

### File Organization
```
Seminar_OAuth/
├── app/
│   ├── index.tsx          # Splash screen (check auth state)
│   ├── SignIn.tsx         # Login screen (Google + Facebook buttons)
│   ├── Home.tsx           # Home screen (user info display)
│   └── _layout.tsx        # Root layout (AuthProvider wrapper)
├── context/
│   └── AuthContext.tsx    # Global user state management
├── hooks/
│   └── useAuth.tsx        # Auth logic (signIn, signOut, linking)
├── app.json               # Expo config (Firebase + Facebook plugins)
├── google-services.json   # Firebase Android config
├── GoogleService-Info.plist # Firebase iOS config
└── eas.json              # EAS Build config
```

### Key Components

#### `useAuth.tsx` (222 lines)
```typescript
export function useAuth() {
  // ✅ onGoogleSignIn(): Đăng nhập Google
  // ✅ onFacebookSignIn(): Đăng nhập Facebook + Account linking
  // ✅ onSignOut(): Đăng xuất
  return { user, onGoogleSignIn, onFacebookSignIn, onSignOut };
}
```

#### `SignIn.tsx` (161 lines)
```typescript
export default function SignIn() {
  // ✅ 2 separate loading states
  // ✅ GoogleSigninButton (312x48px)
  // ✅ FacebookButton (312x48px, custom design)
  // ✅ Dual ActivityIndicator
}
```

#### `Home.tsx`
```typescript
export default function Home() {
  // ✅ Display user info (name, email, photo, uid)
  // ✅ Show providerData (Google, Facebook)
  // ✅ Show metadata (creationTime, lastSignInTime)
  // ✅ Sign out button
}
```

---

## 11. 🎓 Key Learnings

### OAuth 2.0 Fundamentals
1. **OAuth ≠ Authentication**: OAuth là ủy quyền (authorization), OpenID Connect mới là xác thực
2. **ID Token vs Access Token**: ID Token chứa user info, Access Token dùng để gọi API
3. **Never see password**: App không bao giờ nhận mật khẩu user
4. **Token expiration**: Tokens có thời gian sống giới hạn

### Firebase Auth
1. **Multi-provider support**: 1 email có thể link nhiều providers
2. **Automatic session management**: Firebase SDK tự động lưu session
3. **Secure by default**: Tokens encrypted trong Keychain/Keystore
4. **Account linking**: Xử lý collision khi cùng email dùng nhiều provider

### React Native Best Practices
1. **Separate loading states**: Mỗi async action có state riêng
2. **Error handling**: Luôn có try-catch và hiện Alert cho user
3. **UI consistency**: Buttons cùng kích thước và style
4. **Type safety**: Dùng TypeScript cho tất cả

### Security
1. **Never log tokens**: Không console.log sensitive data
2. **HTTPS only**: Tất cả API calls dùng HTTPS
3. **Client secret**: Không commit vào Git
4. **Token validation**: Backend phải validate mọi token

---

## 12. 🔗 Resources

### Documentation
- [Google Sign-In Documentation](https://developers.google.com/identity/sign-in/android)
- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login)
- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [OAuth 2.0 RFC](https://oauth.net/2/)
- [OpenID Connect Spec](https://openid.net/connect/)

### Tools
- [JWT Debugger](https://jwt.io) - Decode ID Tokens
- [Facebook Graph API Explorer](https://developers.facebook.com/tools/explorer/)
- [Google OAuth Playground](https://developers.google.com/oauthplayground/)

### Libraries
- [@react-native-google-signin/google-signin](https://github.com/react-native-google-signin/google-signin)
- [react-native-fbsdk-next](https://github.com/thebergamo/react-native-fbsdk-next)
- [@react-native-firebase/auth](https://rnfirebase.io/auth/usage)

---

## 📌 Final Notes

Dự án này là **production-ready** OAuth implementation với:
- ✅ 2 authentication providers (Google + Facebook)
- ✅ Account linking khi email trùng
- ✅ Secure token handling
- ✅ Clean UI/UX với dual loading states
- ✅ Proper error handling
- ✅ Type-safe TypeScript code

**Sẵn sàng deploy lên Production!** 🚀
