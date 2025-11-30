import {
  FacebookAuthProvider,
  fetchSignInMethodsForEmail,
  signOut as firebaseSignOut,
  getAuth,
  GoogleAuthProvider,
  linkWithCredential,
  signInWithCredential,
  type FirebaseAuthTypes,
} from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useContext } from 'react';
import { Alert } from 'react-native';
import { AccessToken, LoginManager } from 'react-native-fbsdk-next';
import { AuthContext, type User } from '../context/AuthContext';

// Configuration constants
const GOOGLE_WEB_CLIENT_ID = '420441521685-18fm24pud4pq3ge16nk69e689a2p5ta1.apps.googleusercontent.com';
const FACEBOOK_PERMISSIONS = ['public_profile', 'email'];
const FACEBOOK_GRAPH_API_URL = 'https://graph.facebook.com/me?fields=email&access_token=';

// Error codes
const AUTH_ERROR_CODES = {
  ACCOUNT_EXISTS: 'auth/account-exists-with-different-credential',
} as const;

// Initialize Google Sign-In
GoogleSignin.configure({
  webClientId: GOOGLE_WEB_CLIENT_ID,
});

/**
 * Helper function to transform Firebase user to application User type
 */
function mapFirebaseUserToUser(firebaseUser: FirebaseAuthTypes.User): User {
  return {
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
  };
}

/**
 * Helper function to get email from Facebook access token
 */
async function getFacebookEmail(accessToken: string): Promise<string | null> {
  try {
    const response = await fetch(`${FACEBOOK_GRAPH_API_URL}${accessToken}`);
    const data = await response.json();
    return data.email || null;
  } catch (error) {
    console.error('Error fetching Facebook email:', error);
    return null;
  }
}

/**
 * Helper function to perform Google Sign-In and get credential
 */
async function getGoogleCredential(): Promise<FirebaseAuthTypes.AuthCredential> {
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const signInResult = await GoogleSignin.signIn();
  const idToken = signInResult.data?.idToken;
  
  if (!idToken) {
    throw new Error('No ID token found');
  }
  
  return GoogleAuthProvider.credential(idToken);
}

/**
 * Helper function to automatically link Google account with Facebook
 */
async function autoLinkWithGoogle(
  authInstance: FirebaseAuthTypes.Module,
  facebookCredential: FirebaseAuthTypes.AuthCredential
): Promise<FirebaseAuthTypes.User> {
  // Sign in with Google first
  const googleCredential = await getGoogleCredential();
  const userCredential = await signInWithCredential(authInstance, googleCredential);
  
  // Link with Facebook credential
  await linkWithCredential(userCredential.user, facebookCredential);
  
  // Sign in again with Facebook to get full Facebook data
  const finalUserCredential = await signInWithCredential(authInstance, facebookCredential);
  return finalUserCredential.user;
}

export function useAuth() {
 const { user, setUser } = useContext(AuthContext);
 const authInstance = getAuth();
 
  /**
   * Sign in with Google account
   */
  async function onGoogleSignIn() {
    try {
      const googleCredential = await getGoogleCredential();
      const userCredential = await signInWithCredential(authInstance, googleCredential);
      setUser(mapFirebaseUserToUser(userCredential.user));
    } catch (error) {
      console.error('Google Sign-In error:', error);
      throw error;
    }
  }
 
  /**
   * Sign in with Facebook account
   * Automatically links with existing Google account if email matches
   */
  async function onFacebookSignIn() {
    try {
      // Request Facebook permissions
      const loginResult = await LoginManager.logInWithPermissions(FACEBOOK_PERMISSIONS);
      
      if (loginResult.isCancelled) {
        throw new Error('User cancelled the login process');
      }
      
      // Get Facebook access token
      const accessToken = await AccessToken.getCurrentAccessToken();
      
      if (!accessToken) {
        throw new Error('No access token found');
      }
      
      // Create Firebase credential
      const facebookCredential = FacebookAuthProvider.credential(accessToken.accessToken);
      
      try {
        // Try direct sign in
        const userCredential = await signInWithCredential(authInstance, facebookCredential);
        setUser(mapFirebaseUserToUser(userCredential.user));
      } catch (error: any) {
        // Handle account exists with different credential
        if (error?.code === AUTH_ERROR_CODES.ACCOUNT_EXISTS) {
          await handleAccountExistsError(error, accessToken.accessToken, facebookCredential);
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('Facebook Sign-In error:', error);
      throw error;
    }
  }
  
  /**
   * Handle account exists error by automatically linking accounts
   */
  async function handleAccountExistsError(
    error: any,
    accessToken: string,
    facebookCredential: FirebaseAuthTypes.AuthCredential
  ) {
    // Get email from error or Facebook profile
    let email = error?.email;
    
    if (!email) {
      email = await getFacebookEmail(accessToken);
    }
    
    if (!email) {
      Alert.alert('Lỗi', 'Không thể lấy email từ Facebook. Vui lòng thử lại.');
      return;
    }
    
    // Check if account exists with Google provider
    const signInMethods = await fetchSignInMethodsForEmail(authInstance, email);
    const hasGoogleProvider = signInMethods.includes(GoogleAuthProvider.PROVIDER_ID);
    
    if (hasGoogleProvider) {
      // Automatically link with Google account
      await handleAutoLinkWithGoogle(email, facebookCredential);
    } else {
      // Show manual linking prompt for other providers
      showManualLinkPrompt(email, facebookCredential);
    }
  }
  
  /**
   * Automatically link Facebook with existing Google account
   */
  async function handleAutoLinkWithGoogle(
    email: string,
    facebookCredential: FirebaseAuthTypes.AuthCredential
  ) {
    try {
      const linkedUser = await autoLinkWithGoogle(authInstance, facebookCredential);
      setUser(mapFirebaseUserToUser(linkedUser));
      Alert.alert(
        'Thành công',
        `Tài khoản Facebook đã được tự động liên kết với tài khoản Google (${email}) và đăng nhập thành công!`
      );
    } catch (linkError) {
      console.error('Auto-link error:', linkError);
      Alert.alert(
        'Lỗi liên kết tự động',
        'Không thể tự động liên kết tài khoản. Vui lòng thử lại hoặc liên hệ hỗ trợ.'
      );
    }
  }
  
  /**
   * Show manual linking prompt for non-Google providers
   */
  function showManualLinkPrompt(
    email: string,
    facebookCredential: FirebaseAuthTypes.AuthCredential
  ) {
    Alert.alert(
      'Tài khoản đã tồn tại',
      `Email ${email} đã được đăng ký bằng phương thức khác. Bạn có muốn liên kết Facebook với tài khoản này không?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Liên kết',
          onPress: async () => {
            try {
              const linkedUser = await autoLinkWithGoogle(authInstance, facebookCredential);
              setUser(mapFirebaseUserToUser(linkedUser));
              Alert.alert('Thành công', 'Đã liên kết và đăng nhập thành công!');
            } catch (linkError) {
              console.error('Manual link error:', linkError);
              Alert.alert('Lỗi', 'Không thể liên kết tài khoản. Vui lòng thử lại.');
            }
          },
        },
      ]
    );
  }
 
  /**
   * Sign out from all authentication providers
   */
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