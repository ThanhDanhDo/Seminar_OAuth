import { useRouter } from 'expo-router';
import { useEffect, useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';

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
    
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('vi-VN');
    };
    
    const getProviderName = (providerId: string) => {
        switch (providerId) {
            case 'google.com': return 'Google';
            case 'facebook.com': return 'Facebook';
            case 'password': return 'Email/Password';
            default: return providerId;
        }
    };
    
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    {user?.photoURL && (
                        <Image 
                            source={{ uri: user.photoURL }} 
                            style={styles.avatar}
                        />
                    )}
                    <Text style={styles.welcomeText}>
                        Xin chào, {user?.displayName || 'User'}!
                    </Text>
                </View>

                {/* OAuth Demo Features */}
                <View style={styles.demoSection}>
                    <Text style={styles.demoTitle}>🎓 OAuth Demo Features</Text>
                    
                    <TouchableOpacity 
                        style={styles.demoButton}
                        onPress={() => router.push('/OAuthFlowVisualizer')}
                    >
                        <Text style={styles.demoButtonIcon}>🔄</Text>
                        <View style={styles.demoButtonContent}>
                            <Text style={styles.demoButtonTitle}>OAuth Flow Visualizer</Text>
                            <Text style={styles.demoButtonDesc}>Xem từng bước OAuth 2.0 flow</Text>
                        </View>
                        <Text style={styles.demoButtonArrow}>→</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.demoButton}
                        onPress={() => router.push('/JWTInspector')}
                    >
                        <Text style={styles.demoButtonIcon}>🔐</Text>
                        <View style={styles.demoButtonContent}>
                            <Text style={styles.demoButtonTitle}>JWT Token Inspector</Text>
                            <Text style={styles.demoButtonDesc}>Decode và analyze ID Token</Text>
                        </View>
                        <Text style={styles.demoButtonArrow}>→</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.demoButton}
                        onPress={() => router.push('/SecurityLab')}
                    >
                        <Text style={styles.demoButtonIcon}>🛡️</Text>
                        <View style={styles.demoButtonContent}>
                            <Text style={styles.demoButtonTitle}>Security Lab</Text>
                            <Text style={styles.demoButtonDesc}>Tìm hiểu các attack vectors</Text>
                        </View>
                        <Text style={styles.demoButtonArrow}>→</Text>
                    </TouchableOpacity>
                </View>
                
                <View style={styles.infoCard}>
                    <Text style={styles.sectionTitle}>📋 Thông Tin Cơ Bản</Text>
                    
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Tên hiển thị:</Text>
                        <Text style={styles.value}>{user?.displayName || 'N/A'}</Text>
                    </View>
                    
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Email:</Text>
                        <Text style={styles.value}>{user?.email || 'N/A'}</Text>
                    </View>
                    
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Email xác thực:</Text>
                        <Text style={[styles.value, user?.emailVerified ? styles.verified : styles.notVerified]}>
                            {user?.emailVerified ? '✅ Đã xác thực' : '❌ Chưa xác thực'}
                        </Text>
                    </View>
                    
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Số điện thoại:</Text>
                        <Text style={styles.value}>{user?.phoneNumber || 'N/A'}</Text>
                    </View>
                    
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Firebase UID:</Text>
                        <Text style={styles.valueSmall}>{user?.uid || 'N/A'}</Text>
                    </View>
                </View>
                
                {user?.metadata && (
                    <View style={styles.infoCard}>
                        <Text style={styles.sectionTitle}>⏰ Thời Gian</Text>
                        
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Tạo tài khoản:</Text>
                            <Text style={styles.value}>{formatDate(user.metadata.creationTime)}</Text>
                        </View>
                        
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Đăng nhập lần cuối:</Text>
                            <Text style={styles.value}>{formatDate(user.metadata.lastSignInTime)}</Text>
                        </View>
                    </View>
                )}
                
                {user?.providerData && user.providerData.length > 0 && (
                    <View style={styles.infoCard}>
                        <Text style={styles.sectionTitle}>🔐 Phương Thức Đăng Nhập</Text>
                        
                        {user.providerData.map((provider, index) => (
                            <View key={index} style={styles.providerCard}>
                                <Text style={styles.providerName}>
                                    {getProviderName(provider.providerId)}
                                </Text>
                                
                                {provider.uid && (
                                    <View style={styles.infoRow}>
                                        <Text style={styles.labelSmall}>Provider UID:</Text>
                                        <Text style={styles.valueSmall}>{provider.uid}</Text>
                                    </View>
                                )}
                                
                                {provider.email && (
                                    <View style={styles.infoRow}>
                                        <Text style={styles.labelSmall}>Email:</Text>
                                        <Text style={styles.valueSmall}>{provider.email}</Text>
                                    </View>
                                )}
                                
                                {provider.displayName && (
                                    <View style={styles.infoRow}>
                                        <Text style={styles.labelSmall}>Tên:</Text>
                                        <Text style={styles.valueSmall}>{provider.displayName}</Text>
                                    </View>
                                )}
                                
                                {provider.phoneNumber && (
                                    <View style={styles.infoRow}>
                                        <Text style={styles.labelSmall}>SĐT:</Text>
                                        <Text style={styles.valueSmall}>{provider.phoneNumber}</Text>
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>
                )}
                
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
            </ScrollView>
        </SafeAreaView>
    );  
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#4285F4',
  },
  welcomeText: { 
    fontSize: 24, 
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    flex: 1,
  },
  labelSmall: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  valueSmall: {
    fontSize: 12,
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  verified: {
    color: '#34A853',
    fontWeight: '600',
  },
  notVerified: {
    color: '#EA4335',
    fontWeight: '600',
  },
  providerCard: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4285F4',
  },
  providerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4285F4',
    marginBottom: 8,
  },
  buttonContainer: {
    marginTop: 8,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#DB4437',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  demoSection: {
    marginBottom: 20,
  },
  demoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  demoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  demoButtonIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  demoButtonContent: {
    flex: 1,
  },
  demoButtonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  demoButtonDesc: {
    fontSize: 13,
    color: '#666',
  },
  demoButtonArrow: {
    fontSize: 20,
    color: '#4285F4',
    marginLeft: 8,
  },
});
