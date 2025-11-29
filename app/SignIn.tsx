import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { useRouter } from 'expo-router';
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';

export default function SignIn() {
    const { onGoogleSignIn, onFacebookSignIn, user } = useAuth();
    const router = useRouter();
    const [loadingGoogle, setLoadingGoogle] = useState(false);
    const [loadingFacebook, setLoadingFacebook] = useState(false);
    
    useEffect(() => {
        if (user) {
            router.replace('/Home');
        }
    }, [user]);
    
    const handleGoogleSignIn = async () => {
        try {
            setLoadingGoogle(true);
            await onGoogleSignIn();
        } catch (error) {
            Alert.alert('Lỗi đăng nhập', 'Không thể đăng nhập bằng Google. Vui lòng thử lại.');
            console.error(error);
        } finally {
            setLoadingGoogle(false);
        }
    };
    
    const handleFacebookSignIn = async () => {
        try {
            setLoadingFacebook(true);
            await onFacebookSignIn();
        } catch (error) {
            Alert.alert('Lỗi đăng nhập', 'Không thể đăng nhập bằng Facebook. Vui lòng thử lại.');
            console.error(error);
        } finally {
            setLoadingFacebook(false);
        }
    };
    
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.text}>Đăng nhập</Text>
            <View style={styles.buttonContainer}>
                <View style={styles.buttonWrapper}>
                    {loadingGoogle ? (
                        <View style={styles.loadingButton}>
                            <ActivityIndicator size="small" color="#4285F4" />
                        </View>
                    ) : (
                        <GoogleSigninButton
                            size={GoogleSigninButton.Size.Wide}
                            color={GoogleSigninButton.Color.Dark}
                            onPress={handleGoogleSignIn}
                            disabled={loadingGoogle || loadingFacebook}
                        />
                    )}
                </View>
                
                <View style={styles.buttonWrapper}>
                    {loadingFacebook ? (
                        <View style={styles.loadingButton}>
                            <ActivityIndicator size="small" color="#1877F2" />
                        </View>
                    ) : (
                        <TouchableOpacity 
                            style={[styles.facebookButton, (loadingGoogle || loadingFacebook) && styles.buttonDisabled]}
                            onPress={handleFacebookSignIn}
                            disabled={loadingGoogle || loadingFacebook}
                        >
                            <View style={styles.facebookButtonContent}>
                                <View style={styles.iconContainer}>
                                    <Text style={styles.facebookIcon}>f</Text>
                                </View>
                                <Text style={styles.facebookButtonText}>
                                    Sign in with Facebook
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );  
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: { 
    margin: 24, 
    fontSize: 24, 
    fontWeight: 'bold',
    color: '#333',
  },
  buttonContainer: {
    gap: 16,
    alignItems: 'center',
  },
  buttonWrapper: {
    height: 48,
    justifyContent: 'center',
  },
  loadingButton: {
    width: 312,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
  },
  facebookButton: {
    backgroundColor: '#1877F2',
    height: 48,
    width: 312,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  facebookButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  iconContainer: {
    width: 18,
    height: 18,
    backgroundColor: '#fff',
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  facebookIcon: {
    color: '#1877F2',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  facebookButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});
