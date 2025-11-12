import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useAuth } from '../hooks/useAuth';

export default function Index() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    // Chờ một chút để kiểm tra trạng thái đăng nhập
    const timer = setTimeout(() => {
      if (user) {
        router.replace('/Home');
      } else {
        router.replace('/SignIn');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [user]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#4285F4" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
