import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; 
import auth, { 
  getAuth, 
  signInWithCredential, 
  signOut as firebaseSignOut,
  GoogleAuthProvider 
} from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../src/services/authApi';

GoogleSignin.configure({
 webClientId: '420441521685-18fm24pud4pq3ge16nk69e689a2p5ta1.apps.googleusercontent.com', 
});

export function useAuth() {
 const { user, setUser } = useContext(AuthContext);
 const authInstance = getAuth();
 
 async function onGoogleSignIn() {
   try {
     // 1. Google Sign-In
     await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
     const signInResult = await GoogleSignin.signIn();
     const idToken = signInResult.data?.idToken;
     
     if (!idToken) {
       throw new Error('No ID token found');
     }
     
     // 2. Firebase Sign-In
     const googleCredential = GoogleAuthProvider.credential(idToken);
     const userCredential = await signInWithCredential(authInstance, googleCredential);
     const firebaseUser = userCredential.user;
     
     // 3. Get Firebase ID Token
     const firebaseIdToken = await firebaseUser.getIdToken();
     console.log('========================================');
     console.log('🔑 Firebase ID Token for testing:');
     console.log(firebaseIdToken);
     console.log('========================================');
     console.log('📧 User Email:', firebaseUser.email);
     console.log('👤 Display Name:', firebaseUser.displayName);
     console.log('========================================');
     
     // 4. Send to Backend API
     console.log('Sending token to backend...');
     const response = await authApi.login(firebaseIdToken);
     
     // 5. Save Access Token
     await AsyncStorage.setItem('accessToken', response.accessToken);
     await AsyncStorage.setItem('userInfo', JSON.stringify(response.user));
     
     // 6. Set user in context
     setUser({
       displayName: firebaseUser.displayName ?? '',
       email: firebaseUser.email ?? '',
       photoURL: firebaseUser.photoURL ?? '',
       uid: firebaseUser.uid,
     });
     
     console.log('Login successful! Backend user ID:', response.user.id);
   } catch (error: any) {
     console.error('Google Sign-In error:', error);
     console.error('Error details:', error.response?.data);
     throw error;
   }
 }
 
 async function onSignOut() {
   try {
     if (user) {
       setUser(undefined);
       await firebaseSignOut(authInstance);
       await GoogleSignin.signOut();
       await AsyncStorage.removeItem('accessToken');
       await AsyncStorage.removeItem('userInfo');
       console.log('User signed out successfully');
     }
   } catch (error) {
     console.error('Sign-out error:', error);
     throw error;
   }
 }
 
 console.log('TEST LOG - App started');

 return {
   user,
   onGoogleSignIn,
   onSignOut,
 };
}