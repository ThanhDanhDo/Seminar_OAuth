import auth from '@react-native-firebase/auth';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type DecodedToken = {
  header: {
    alg: string;
    kid: string;
    typ: string;
  };
  payload: {
    iss: string;
    azp: string;
    aud: string;
    sub: string;
    email?: string;
    email_verified?: boolean;
    name?: string;
    picture?: string;
    given_name?: string;
    family_name?: string;
    iat: number;
    exp: number;
  };
  signature: string;
};

export default function JWTInspector() {
  const router = useRouter();
  const [rawToken, setRawToken] = useState<string>('');
  const [decoded, setDecoded] = useState<DecodedToken | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    loadToken();
  }, []);

  useEffect(() => {
    if (!decoded) return;

    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const remaining = decoded.payload.exp - now;
      setTimeLeft(remaining);
      setIsExpired(remaining <= 0);
    }, 1000);

    return () => clearInterval(interval);
  }, [decoded]);

  const loadToken = async () => {
    try {
      const user = auth().currentUser;
      if (!user) {
        Alert.alert('Error', 'Vui lòng đăng nhập trước');
        router.back();
        return;
      }

      const idToken = await user.getIdToken();
      setRawToken(idToken);
      decodeJWT(idToken);
    } catch (error) {
      console.error('Load token error:', error);
      Alert.alert('Error', 'Không thể lấy token');
    }
  };

  const decodeJWT = (token: string) => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format');
      }

      // Decode header
      const header = JSON.parse(base64UrlDecode(parts[0]));
      
      // Decode payload
      const payload = JSON.parse(base64UrlDecode(parts[1]));
      
      // Signature (không decode, giữ nguyên)
      const signature = parts[2];

      setDecoded({
        header,
        payload,
        signature,
      });
    } catch (error) {
      console.error('Decode error:', error);
      Alert.alert('Error', 'Không thể decode token');
    }
  };

  const base64UrlDecode = (str: string): string => {
    // Replace URL-safe characters
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    
    // Add padding if needed
    while (str.length % 4) {
      str += '=';
    }
    
    // Decode base64
    const decoded = atob(str);
    
    // Convert to UTF-8
    return decodeURIComponent(
      decoded
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatTimeLeft = (seconds: number) => {
    if (seconds <= 0) return 'Expired';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const copyToClipboard = (text: string, label: string) => {
    // Note: Clipboard API requires expo-clipboard
    Alert.alert('Copied', `${label} đã được copy (giả lập)`);
  };

  const verifySignature = () => {
    Alert.alert(
      'Signature Verification',
      'Trong production, app sẽ:\n\n' +
      '1. Lấy public key từ Google (JWK Set)\n' +
      '2. Verify signature với public key\n' +
      '3. Check issuer (iss) = accounts.google.com\n' +
      '4. Check audience (aud) = your client ID\n' +
      '5. Check expiration (exp) > now\n\n' +
      'Firebase Auth tự động verify tất cả!'
    );
  };

  if (!decoded) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading token...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>JWT Token Inspector</Text>
      </View>

      {/* Expiry Warning */}
      {isExpired ? (
        <View style={[styles.expiryBanner, styles.expiredBanner]}>
          <Text style={styles.expiryText}>⚠️ Token đã hết hạn!</Text>
        </View>
      ) : (
        <View style={styles.expiryBanner}>
          <Text style={styles.expiryText}>⏱️ Expires in: {formatTimeLeft(timeLeft)}</Text>
        </View>
      )}

      <ScrollView style={styles.content}>
        {/* Raw Token */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔗 Raw Token (JWT)</Text>
          <TouchableOpacity 
            style={styles.tokenContainer}
            onPress={() => copyToClipboard(rawToken, 'Token')}
          >
            <Text style={styles.tokenText} numberOfLines={3}>
              {rawToken}
            </Text>
          </TouchableOpacity>
          <Text style={styles.hint}>Tap để copy (giả lập)</Text>
        </View>

        {/* Header */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Header</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>Algorithm:</Text>
              <Text style={styles.value}>{decoded.header.alg}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Key ID:</Text>
              <Text style={styles.value}>{decoded.header.kid}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Type:</Text>
              <Text style={styles.value}>{decoded.header.typ}</Text>
            </View>
          </View>
          <Text style={styles.explanation}>
            💡 Header chứa metadata về token: thuật toán mã hóa (RS256) và key ID để verify signature
          </Text>
        </View>

        {/* Payload */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📦 Payload (Claims)</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>Issuer (iss):</Text>
              <Text style={styles.valueSmall}>{decoded.payload.iss}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Subject (sub):</Text>
              <Text style={styles.valueSmall}>{decoded.payload.sub}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Audience (aud):</Text>
              <Text style={styles.valueSmall} numberOfLines={2}>
                {decoded.payload.aud}
              </Text>
            </View>
            
            {decoded.payload.email && (
              <View style={styles.row}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{decoded.payload.email}</Text>
              </View>
            )}
            
            {decoded.payload.name && (
              <View style={styles.row}>
                <Text style={styles.label}>Name:</Text>
                <Text style={styles.value}>{decoded.payload.name}</Text>
              </View>
            )}

            <View style={styles.divider} />

            <View style={styles.row}>
              <Text style={styles.label}>Issued At (iat):</Text>
              <Text style={styles.valueSmall}>
                {formatTimestamp(decoded.payload.iat)}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Expires At (exp):</Text>
              <Text style={[styles.valueSmall, isExpired && styles.expiredText]}>
                {formatTimestamp(decoded.payload.exp)}
              </Text>
            </View>
          </View>
          <Text style={styles.explanation}>
            💡 Payload chứa thông tin user (claims). Server verify các claims này để xác thực.
          </Text>
        </View>

        {/* Signature */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔐 Signature</Text>
          <View style={styles.card}>
            <TouchableOpacity onPress={() => copyToClipboard(decoded.signature, 'Signature')}>
              <Text style={styles.signatureText} numberOfLines={2}>
                {decoded.signature}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.verifyButton}
              onPress={verifySignature}
            >
              <Text style={styles.verifyButtonText}>🔍 Verify Signature</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.explanation}>
            💡 Signature đảm bảo token không bị giả mạo. Được tạo bằng cách mã hóa (header + payload) với private key của Google.
          </Text>
        </View>

        {/* Security Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🛡️ Security Notes</Text>
          <View style={styles.card}>
            <Text style={styles.securityText}>
              ✅ Token được sign bằng Google private key{'\n'}
              ✅ Chỉ Google public key mới verify được{'\n'}
              ✅ Không thể giả mạo hoặc chỉnh sửa payload{'\n'}
              ✅ Expiration time đảm bảo token hết hạn sau 1 giờ{'\n'}
              ⚠️ KHÔNG lưu token trong AsyncStorage{'\n'}
              ⚠️ KHÔNG gửi token qua URL hoặc log
            </Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    fontSize: 16,
    color: '#4285F4',
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  expiryBanner: {
    backgroundColor: '#FFF3CD',
    padding: 12,
    alignItems: 'center',
  },
  expiredBanner: {
    backgroundColor: '#F8D7DA',
  },
  expiryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#856404',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  tokenContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  tokenText: {
    fontSize: 11,
    color: '#666',
    fontFamily: 'monospace',
  },
  hint: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    fontStyle: 'italic',
  },
  row: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    color: '#333',
  },
  valueSmall: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'monospace',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  expiredText: {
    color: '#EA4335',
    fontWeight: 'bold',
  },
  signatureText: {
    fontSize: 11,
    color: '#666',
    fontFamily: 'monospace',
    marginBottom: 12,
  },
  verifyButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  explanation: {
    fontSize: 13,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  securityText: {
    fontSize: 13,
    color: '#333',
    lineHeight: 22,
  },
});
