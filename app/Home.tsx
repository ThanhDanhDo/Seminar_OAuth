import { useEffect, useState } from "react";
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, SafeAreaView, TouchableOpacity, View, Image, Alert, ActivityIndicator } from 'react-native';
import { userApi } from '../src/services/userApi';
import { UserInfo } from '../src/services/authApi';

export default function Home() {
    const { onSignOut, user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [backendUser, setBackendUser] = useState<UserInfo | null>(null);
    const [fetchingUser, setFetchingUser] = useState(true);
    
    useEffect(() => {
        if (!user) {
            router.replace('/SignIn');
        } else {
            fetchUserInfo();
        }
    }, [user]);
    
    const fetchUserInfo = async () => {
        try {
            setFetchingUser(true);
            const info = await userApi.getUserInfo();
            setBackendUser(info);
            console.log('✅ Backend user info loaded:', info);
        } catch (error: any) {
            console.error('❌ Failed to fetch backend user:', error);
            Alert.alert('Thông báo', 'Không thể kết nối backend. Hiển thị thông tin Firebase.');
        } finally {
            setFetchingUser(false);
        }
    };
    
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

    if (fetchingUser) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="#4285F4" />
                <Text style={styles.loadingText}>Đang tải thông tin...</Text>
            </SafeAreaView>
        );
    }

    const displayUser = backendUser || user;
    
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {(displayUser?.photoUrl || user?.photoURL) && (
                    <Image 
                        source={{ uri: displayUser?.photoUrl || user?.photoURL || '' }} 
                        style={styles.avatar}
                    />
                )}
                <Text style={styles.welcomeText}>
                    Xin chào, {displayUser?.displayName || user?.displayName}!
                </Text>
                <Text style={styles.emailText}>
                    {displayUser?.email || user?.email}
                </Text>

                {backendUser && (
                    <View style={styles.infoCard}>
                        <Text style={styles.cardTitle}>📊 Thông tin từ Backend</Text>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Backend ID:</Text>
                            <Text style={styles.value}>{backendUser.id}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Provider:</Text>
                            <Text style={styles.value}>{backendUser.provider}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Firebase UID:</Text>
                            <Text style={styles.valueSmall}>{backendUser.firebaseUid.substring(0, 15)}...</Text>
                        </View>
                    </View>
                )}

                <TouchableOpacity 
                    style={styles.refreshButton}
                    onPress={fetchUserInfo}
                >
                    <Text style={styles.refreshButtonText}>🔄 Làm mới</Text>
                </TouchableOpacity>
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
    marginBottom: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  infoCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    width: '100%',
    maxWidth: 350,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  label: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '600',
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  valueSmall: {
    fontSize: 12,
    color: '#495057',
    fontFamily: 'monospace',
  },
  refreshButton: {
    backgroundColor: '#34A853',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 16,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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
