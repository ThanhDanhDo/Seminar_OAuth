import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Attack = {
  id: string;
  name: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  mitigation: string;
  icon: string;
};

const attacks: Attack[] = [
  {
    id: 'csrf',
    name: 'CSRF Attack',
    description: 'Cross-Site Request Forgery: Attacker lợi dụng session của victim để thực hiện request giả mạo',
    severity: 'high',
    mitigation: 'State Parameter: Random string được gửi đi và verify khi nhận callback',
    icon: '🎣',
  },
  {
    id: 'code-interception',
    name: 'Authorization Code Interception',
    description: 'Man-in-the-Middle tấn công redirect URI để đánh cắp authorization code',
    severity: 'high',
    mitigation: 'PKCE (Proof Key for Code Exchange): Code verifier + code challenge',
    icon: '🕵️',
  },
  {
    id: 'token-leakage',
    name: 'Token Leakage via URL',
    description: 'Token bị lộ qua browser history, logs, hoặc Referer header',
    severity: 'medium',
    mitigation: 'Authorization Code Flow thay vì Implicit Flow',
    icon: '🔓',
  },
  {
    id: 'phishing',
    name: 'OAuth Phishing',
    description: 'Fake OAuth consent screen để đánh cắp credentials',
    severity: 'high',
    mitigation: 'Kiểm tra URL domain, HTTPS, certificate',
    icon: '🎭',
  },
  {
    id: 'scope-creep',
    name: 'Scope Creep Attack',
    description: 'App yêu cầu quá nhiều permissions không cần thiết',
    severity: 'low',
    mitigation: 'Principle of Least Privilege: Chỉ xin quyền cần thiết',
    icon: '🔍',
  },
  {
    id: 'token-replay',
    name: 'Token Replay Attack',
    description: 'Attacker sử dụng lại token bị đánh cắp',
    severity: 'medium',
    mitigation: 'Short-lived tokens + Refresh token rotation',
    icon: '🔁',
  },
];

export default function SecurityLab() {
  const router = useRouter();
  const [selectedAttack, setSelectedAttack] = useState<Attack | null>(null);

  const getSeverityColor = (severity: Attack['severity']) => {
    switch (severity) {
      case 'high': return '#EA4335';
      case 'medium': return '#FFA500';
      case 'low': return '#FBBC04';
      default: return '#999';
    }
  };

  const getSeverityText = (severity: Attack['severity']) => {
    switch (severity) {
      case 'high': return 'HIGH';
      case 'medium': return 'MEDIUM';
      case 'low': return 'LOW';
      default: return 'UNKNOWN';
    }
  };

  const demoCSRF = () => {
    Alert.alert(
      '🎣 CSRF Attack Demo',
      'Scenario:\n\n' +
      '1️⃣ Victim đang login vào YourApp\n' +
      '2️⃣ Attacker gửi link: evil.com/trigger-oauth\n' +
      '3️⃣ Victim click → OAuth flow bắt đầu\n' +
      '4️⃣ NHƯNG: Attacker đã chuẩn bị redirect_uri về server của họ\n' +
      '5️⃣ Authorization code bị đánh cắp!\n\n' +
      '✅ Mitigation: STATE PARAMETER\n\n' +
      'App tạo random state="abc123"\n' +
      'Gửi trong OAuth request\n' +
      'Verify state khi nhận callback\n' +
      'Nếu không khớp → Reject!'
    );
  };

  const demoPKCE = () => {
    const codeVerifier = 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk';
    const codeChallenge = 'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM';

    Alert.alert(
      '🕵️ PKCE Demo',
      'Flow:\n\n' +
      `1️⃣ App tạo code_verifier (random):\n${codeVerifier.substring(0, 20)}...\n\n` +
      `2️⃣ Hash → code_challenge:\n${codeChallenge.substring(0, 20)}...\n\n` +
      '3️⃣ Gửi code_challenge trong OAuth request\n\n' +
      '4️⃣ Nhận authorization code\n\n' +
      '5️⃣ Exchange code + code_verifier → tokens\n\n' +
      '6️⃣ Server verify: hash(code_verifier) == code_challenge\n\n' +
      '✅ Attacker không có code_verifier → Không đổi được token!',
      [
        { text: 'Got it!', style: 'default' }
      ]
    );
  };

  const demoTokenLeakage = () => {
    Alert.alert(
      '🔓 Token Leakage Demo',
      'BAD: Implicit Flow\n' +
      'Redirect: app://callback#access_token=ya29...\n' +
      '❌ Token trong URL fragment\n' +
      '❌ Có thể bị log trong browser history\n' +
      '❌ Có thể leak qua Referer header\n\n' +
      'GOOD: Authorization Code Flow\n' +
      'Redirect: app://callback?code=xyz123\n' +
      '✅ Code trong query parameter\n' +
      '✅ Code exchange → Token ở backend\n' +
      '✅ Token không bao giờ xuất hiện trong URL\n\n' +
      'Project này dùng Authorization Code Flow ✅'
    );
  };

  const demoPhishing = () => {
    Alert.alert(
      '🎭 OAuth Phishing Demo',
      'Attack Scenario:\n\n' +
      '1️⃣ Attacker tạo fake OAuth screen:\n' +
      '   https://accounts-google.com (chú ý -)\n' +
      '   → Giả mạo accounts.google.com\n\n' +
      '2️⃣ Victim nhập email + password vào fake page\n\n' +
      '3️⃣ Credentials bị đánh cắp!\n\n' +
      'Defense:\n' +
      '✅ Native SDK (Google Sign-In): Không qua browser\n' +
      '✅ Check HTTPS certificate\n' +
      '✅ Verify domain chính xác\n' +
      '✅ User education: Cảnh giác với URL lạ\n\n' +
      'Project này dùng native SDK → An toàn ✅'
    );
  };

  const demoScopeCreep = () => {
    Alert.alert(
      '🔍 Scope Creep Demo',
      'BAD App:\n' +
      '❌ Yêu cầu: profile, email, drive, calendar, contacts, photos\n' +
      '❌ User: "Tại sao cần nhiều quyền thế?"\n' +
      '❌ Result: User từ chối cấp quyền\n\n' +
      'GOOD App:\n' +
      '✅ Chỉ yêu cầu: profile, email\n' +
      '✅ User: "OK, reasonable"\n' +
      '✅ Result: User chấp nhận\n\n' +
      'Principle of Least Privilege:\n' +
      '→ Chỉ xin quyền cần thiết\n' +
      '→ Incremental authorization (xin từ từ)\n' +
      '→ Giải thích tại sao cần mỗi quyền\n\n' +
      'Project này: openid, profile, email ONLY ✅'
    );
  };

  const demoTokenReplay = () => {
    Alert.alert(
      '🔁 Token Replay Attack Demo',
      'Scenario:\n\n' +
      '1️⃣ Attacker đánh cắp access token (via MITM)\n' +
      '2️⃣ Token còn valid 1 giờ\n' +
      '3️⃣ Attacker sử dụng token để gọi API\n' +
      '4️⃣ Server accept vì token hợp lệ\n\n' +
      'Mitigation:\n' +
      '✅ Short-lived tokens (1 giờ)\n' +
      '✅ Refresh token rotation\n' +
      '✅ Device fingerprinting\n' +
      '✅ Anomaly detection (IP, location)\n' +
      '✅ HTTPS everywhere\n\n' +
      'Firebase Auth tự động handle refresh ✅'
    );
  };

  const handleDemo = (attackId: string) => {
    switch (attackId) {
      case 'csrf':
        demoCSRF();
        break;
      case 'code-interception':
        demoPKCE();
        break;
      case 'token-leakage':
        demoTokenLeakage();
        break;
      case 'phishing':
        demoPhishing();
        break;
      case 'scope-creep':
        demoScopeCreep();
        break;
      case 'token-replay':
        demoTokenReplay();
        break;
      default:
        Alert.alert('Demo', 'Coming soon!');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>OAuth Security Lab</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.banner}>
          <Text style={styles.bannerIcon}>🛡️</Text>
          <Text style={styles.bannerTitle}>Security Threats & Mitigation</Text>
          <Text style={styles.bannerText}>
            Hiểu các attack vectors và cách defend để implement OAuth an toàn
          </Text>
        </View>

        {attacks.map((attack) => (
          <TouchableOpacity
            key={attack.id}
            style={styles.card}
            onPress={() => setSelectedAttack(attack)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.attackIcon}>{attack.icon}</Text>
              <View style={styles.cardTitleContainer}>
                <Text style={styles.attackName}>{attack.name}</Text>
                <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(attack.severity) }]}>
                  <Text style={styles.severityText}>{getSeverityText(attack.severity)}</Text>
                </View>
              </View>
            </View>

            <Text style={styles.description}>{attack.description}</Text>

            <View style={styles.mitigationContainer}>
              <Text style={styles.mitigationLabel}>✅ Mitigation:</Text>
              <Text style={styles.mitigation}>{attack.mitigation}</Text>
            </View>

            <TouchableOpacity
              style={styles.demoButton}
              onPress={() => handleDemo(attack.id)}
            >
              <Text style={styles.demoButtonText}>🎬 View Demo</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        {/* Best Practices */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Best Practices</Text>
          <View style={styles.card}>
            <Text style={styles.bestPractice}>
              ✅ Use Authorization Code Flow (not Implicit){'\n'}
              ✅ Implement PKCE for mobile apps{'\n'}
              ✅ Always use state parameter{'\n'}
              ✅ Validate redirect_uri strictly{'\n'}
              ✅ Use HTTPS everywhere{'\n'}
              ✅ Short-lived access tokens{'\n'}
              ✅ Rotate refresh tokens{'\n'}
              ✅ Principle of Least Privilege (minimal scopes){'\n'}
              ✅ Verify token signatures{'\n'}
              ✅ Never log sensitive data
            </Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Detail Modal */}
      <Modal
        visible={selectedAttack !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedAttack(null)}
      >
        {selectedAttack && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalIcon}>{selectedAttack.icon}</Text>
                <Text style={styles.modalTitle}>{selectedAttack.name}</Text>
                <TouchableOpacity onPress={() => setSelectedAttack(null)}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(selectedAttack.severity) }]}>
                  <Text style={styles.severityText}>
                    Severity: {getSeverityText(selectedAttack.severity)}
                  </Text>
                </View>

                <Text style={styles.modalSectionTitle}>📝 Description</Text>
                <Text style={styles.modalText}>{selectedAttack.description}</Text>

                <Text style={styles.modalSectionTitle}>✅ Mitigation</Text>
                <Text style={styles.modalText}>{selectedAttack.mitigation}</Text>

                <TouchableOpacity
                  style={styles.modalDemoButton}
                  onPress={() => {
                    setSelectedAttack(null);
                    handleDemo(selectedAttack.id);
                  }}
                >
                  <Text style={styles.modalDemoButtonText}>🎬 View Full Demo</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        )}
      </Modal>
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
  content: {
    flex: 1,
    padding: 16,
  },
  banner: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#4285F4',
  },
  bannerIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  bannerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  attackIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  cardTitleContainer: {
    flex: 1,
  },
  attackName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  severityText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fff',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  mitigationContainer: {
    backgroundColor: '#f0f8ff',
    padding: 12,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#4285F4',
    marginBottom: 12,
  },
  mitigationLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  mitigation: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  demoButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  demoButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  bestPractice: {
    fontSize: 13,
    color: '#333',
    lineHeight: 22,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  modalTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    fontSize: 24,
    color: '#666',
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  modalText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  modalDemoButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  modalDemoButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
