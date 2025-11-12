import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; 
import auth, { 
  getAuth, 
  signInWithCredential, 
  signOut as firebaseSignOut,
  GoogleAuthProvider 
} from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

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
     });
   } catch (error) {
     console.error('Google Sign-In error:', error);
     throw error;
   }
 }
 
 async function onSignOut() {
   try {
     if (user) {
       setUser(undefined);
       await firebaseSignOut(authInstance);
       await GoogleSignin.signOut();
     }
   } catch (error) {
     console.error('Sign-out error:', error);
     throw error;
   }
 }
 
 return {
   user,
   onGoogleSignIn,
   onSignOut,
 };
}