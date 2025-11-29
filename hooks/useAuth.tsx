import {
    FacebookAuthProvider,
    signOut as firebaseSignOut,
    getAuth,
    GoogleAuthProvider,
    linkWithCredential,
    signInWithCredential
} from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useContext } from 'react';
import { Alert } from 'react-native';
import { AccessToken, LoginManager } from 'react-native-fbsdk-next';
import { AuthContext } from '../context/AuthContext';

// !! QUAN TRỌNG: Lấy Web Client ID của bạn từ Firebase
GoogleSignin.configure({
 webClientId: '420441521685-18fm24pud4pq3ge16nk69e689a2p5ta1.apps.googleusercontent.com', 
});

export function useAuth() {
 const { user, setUser } = useContext(AuthContext);
 const authInstance = getAuth();
 
 async function onGoogleSignIn() {
   try {
     await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
     
     const signInResult = await GoogleSignin.signIn();
     const idToken = signInResult.data?.idToken;
     
     if (!idToken) {
       throw new Error('No ID token found');
     }
     
     const googleCredential = GoogleAuthProvider.credential(idToken);
     const userCredential = await signInWithCredential(authInstance, googleCredential);
     const firebaseUser = userCredential.user;
     
     setUser({
       displayName: firebaseUser.displayName ?? '',
       email: firebaseUser.email ?? '',
       photoURL: firebaseUser.photoURL ?? '',
       uid: firebaseUser.uid,
       phoneNumber: firebaseUser.phoneNumber ?? undefined,
       emailVerified: firebaseUser.emailVerified,
       providerData: firebaseUser.providerData.map(provider => ({
         providerId: provider.providerId,
         uid: provider.uid,
         displayName: provider.displayName ?? undefined,
         email: provider.email ?? undefined,
         photoURL: provider.photoURL ?? undefined,
         phoneNumber: provider.phoneNumber ?? undefined,
       })),
       metadata: {
         creationTime: firebaseUser.metadata.creationTime,
         lastSignInTime: firebaseUser.metadata.lastSignInTime,
       },
     });
   } catch (error) {
     console.error('Google Sign-In error:', error);
     throw error;
   }
 }
 
 async function onFacebookSignIn() {
   try {
     // Yêu cầu quyền từ Facebook
     const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
     
     if (result.isCancelled) {
       throw new Error('User cancelled the login process');
     }
     
     // Lấy Access Token
     const data = await AccessToken.getCurrentAccessToken();
     
     if (!data) {
       throw new Error('No access token found');
     }
     
     // Tạo Firebase credential
     const facebookCredential = FacebookAuthProvider.credential(data.accessToken);
     
     try {
       // Thử sign in trực tiếp
       const userCredential = await signInWithCredential(authInstance, facebookCredential);
       const firebaseUser = userCredential.user;
       
       setUser({
         displayName: firebaseUser.displayName ?? '',
         email: firebaseUser.email ?? '',
         photoURL: firebaseUser.photoURL ?? '',
         uid: firebaseUser.uid,
         phoneNumber: firebaseUser.phoneNumber ?? undefined,
         emailVerified: firebaseUser.emailVerified,
         providerData: firebaseUser.providerData.map(provider => ({
           providerId: provider.providerId,
           uid: provider.uid,
           displayName: provider.displayName ?? undefined,
           email: provider.email ?? undefined,
           photoURL: provider.photoURL ?? undefined,
           phoneNumber: provider.phoneNumber ?? undefined,
         })),
         metadata: {
           creationTime: firebaseUser.metadata.creationTime,
           lastSignInTime: firebaseUser.metadata.lastSignInTime,
         },
       });
     } catch (error: any) {
       // Handle account exists with different credential
       if (error?.code === 'auth/account-exists-with-different-credential') {
         // Lấy email từ error hoặc từ Facebook profile
         let email = error?.email;
         
         // Nếu không có email từ error, thử lấy từ Facebook
         if (!email) {
           try {
             const profile = await fetch(
               `https://graph.facebook.com/me?fields=email&access_token=${data.accessToken}`
             );
             const profileData = await profile.json();
             email = profileData.email;
           } catch (e) {
             console.error('Cannot get email from Facebook:', e);
           }
         }
         
         if (!email) {
           Alert.alert('Lỗi', 'Không thể lấy email từ Facebook. Vui lòng thử lại.');
           return;
         }
         
         Alert.alert(
           'Tài khoản đã tồn tại',
           `Email ${email} đã được đăng ký bằng phương thức khác (Google). Bạn có muốn liên kết Facebook với tài khoản này và đăng nhập không?`,
           [
             { text: 'Hủy', style: 'cancel' },
             {
               text: 'Liên kết',
               onPress: async () => {
                 try {
                   // Tự động đăng nhập với Google trong background
                   await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
                   const signInResult = await GoogleSignin.signIn();
                   const idToken = signInResult.data?.idToken;
                   
                   if (!idToken) {
                     throw new Error('No ID token found');
                   }
                   
                   const googleCredential = GoogleAuthProvider.credential(idToken);
                   const userCredential = await signInWithCredential(authInstance, googleCredential);
                   
                   // Link với Facebook credential
                   await linkWithCredential(userCredential.user, facebookCredential);
                   
                   // Đăng nhập lại với Facebook để có đầy đủ thông tin
                   const finalUser = await signInWithCredential(authInstance, facebookCredential);
                   
                   setUser({
                     displayName: finalUser.user.displayName ?? '',
                     email: finalUser.user.email ?? '',
                     photoURL: finalUser.user.photoURL ?? '',
                     uid: finalUser.user.uid,
                     phoneNumber: finalUser.user.phoneNumber ?? undefined,
                     emailVerified: finalUser.user.emailVerified,
                     providerData: finalUser.user.providerData.map(provider => ({
                       providerId: provider.providerId,
                       uid: provider.uid,
                       displayName: provider.displayName ?? undefined,
                       email: provider.email ?? undefined,
                       photoURL: provider.photoURL ?? undefined,
                       phoneNumber: provider.phoneNumber ?? undefined,
                     })),
                     metadata: {
                       creationTime: finalUser.user.metadata.creationTime,
                       lastSignInTime: finalUser.user.metadata.lastSignInTime,
                     },
                   });
                   
                   Alert.alert('Thành công', 'Đã liên kết và đăng nhập thành công!');
                 } catch (linkError) {
                   console.error('Link error:', linkError);
                   Alert.alert('Lỗi', 'Không thể liên kết tài khoản. Vui lòng thử lại.');
                 }
               }
             }
           ]
         );
         return; // Không throw error nữa
       }
       
       // Các lỗi khác thì throw
       throw error;
     }
   } catch (error) {
     console.error('Facebook Sign-In error:', error);
     throw error;
   }
 }
 
 async function onSignOut() {
   try {
     if (user) {
       setUser(undefined);
       await firebaseSignOut(authInstance);
       await GoogleSignin.signOut();
       await LoginManager.logOut();
     }
   } catch (error) {
     console.error('Sign-out error:', error);
     throw error;
   }
 }
 
 return {
   user,
   onGoogleSignIn,
   onFacebookSignIn,
   onSignOut,
 };
}