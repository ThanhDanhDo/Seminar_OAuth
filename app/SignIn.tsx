import { useEffect, useState } from "react";
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';

export default function SignIn() {
    const { onGoogleSignIn, user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        if (user) {
            router.replace('/Home');
        }
    }, [user]);
    
    const handleGoogleSignIn = async () => {
        try {
            setLoading(true);
            await onGoogleSignIn();
        } catch (error) {
            Alert.alert('Lỗi đăng nhập', 'Không thể đăng nhập bằng Google. Vui lòng thử lại.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.text}>Đăng nhập</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#4285F4" />
            ) : (
                <GoogleSigninButton
                    size={GoogleSigninButton.Size.Wide}
                    color={GoogleSigninButton.Color.Dark}
                    onPress={handleGoogleSignIn}
                    disabled={loading}
                />
            )}
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
});
