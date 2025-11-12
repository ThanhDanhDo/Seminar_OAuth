import { useEffect, useState } from "react";
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, SafeAreaView, TouchableOpacity, View, Image, Alert } from 'react-native';

export default function Home() {
    const { onSignOut, user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        if (!user) {
            router.replace('/SignIn');
        }
    }, [user]);
    
    const handleSignOut = async () => {
        try {
            setLoading(true);
            await onSignOut();
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể đăng xuất. Vui lòng thử lại.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {user?.photoURL && (
                    <Image 
                        source={{ uri: user.photoURL }} 
                        style={styles.avatar}
                    />
                )}
                <Text style={styles.welcomeText}>
                    Xin chào, {user?.displayName}!
                </Text>
                <Text style={styles.emailText}>
                    {user?.email}
                </Text>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleSignOut}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? 'Đang đăng xuất...' : 'Đăng xuất'}
                    </Text>
                </TouchableOpacity>
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
    padding: 20,
  },
  content: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  welcomeText: { 
    fontSize: 24, 
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emailText: {
    fontSize: 16,
    color: '#666',
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 24,
  },
  button: {
    backgroundColor: '#DB4437',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
