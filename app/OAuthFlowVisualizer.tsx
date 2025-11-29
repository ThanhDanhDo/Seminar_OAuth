import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type FlowStep = {
  id: number;
  title: string;
  description: string;
  timestamp: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  payload?: any;
};

export default function OAuthFlowVisualizer() {
  const router = useRouter();
  const [flowSteps, setFlowSteps] = useState<FlowStep[]>([
    {
      id: 1,
      title: 'User nhấn "Sign in with Google"',
      description: 'User tương tác với UI, bắt đầu OAuth flow',
      timestamp: '',
      status: 'pending',
    },
    {
      id: 2,
      title: 'App khởi tạo OAuth request',
      description: 'GoogleSignin.signIn() được gọi',
      timestamp: '',
      status: 'pending',
    },
    {
      id: 3,
      title: 'Redirect đến Google Authorization Server',
      description: 'Mở Google Account Chooser (native UI)',
      timestamp: '',
      status: 'pending',
      payload: {
        endpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
        params: {
          client_id: '420441521685-xxx.apps.googleusercontent.com',
          redirect_uri: 'com.anonymous.seminaroauth:/oauth2redirect',
          response_type: 'code',
          scope: 'openid profile email',
          state: 'random_state_string',
        },
      },
    },
    {
      id: 4,
      title: 'User đăng nhập & đồng ý quyền',
      description: 'Nhập mật khẩu và chấp nhận consent screen',
      timestamp: '',
      status: 'pending',
    },
    {
      id: 5,
      title: 'Google trả về Authorization Code',
      description: 'Redirect về app với code trong URL',
      timestamp: '',
      status: 'pending',
      payload: {
        code: 'ya29.a0AfB_byD8Xh...',
        state: 'random_state_string',
      },
    },
    {
      id: 6,
      title: 'App exchange code → tokens',
      description: 'POST request đến token endpoint',
      timestamp: '',
      status: 'pending',
      payload: {
        endpoint: 'https://oauth2.googleapis.com/token',
        request: {
          grant_type: 'authorization_code',
          code: 'ya29.a0AfB_byD8Xh...',
          redirect_uri: 'com.anonymous.seminaroauth:/oauth2redirect',
          client_id: '420441521685-xxx',
        },
      },
    },
    {
      id: 7,
      title: 'Google trả về ID Token & Access Token',
      description: 'Response chứa tokens',
      timestamp: '',
      status: 'pending',
      payload: {
        id_token: 'eyJhbGciOiJSUzI1NiIs...',
        access_token: 'ya29.a0AfB_byBKZ...',
        expires_in: 3600,
        token_type: 'Bearer',
        scope: 'openid profile email',
      },
    },
    {
      id: 8,
      title: 'App tạo Firebase Credential',
      description: 'GoogleAuthProvider.credential(idToken)',
      timestamp: '',
      status: 'pending',
    },
    {
      id: 9,
      title: 'Firebase verify token với Google',
      description: 'signInWithCredential() validate token',
      timestamp: '',
      status: 'pending',
    },
    {
      id: 10,
      title: 'User authenticated ✅',
      description: 'Firebase session được tạo, user đăng nhập thành công',
      timestamp: '',
      status: 'pending',
    },
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const simulateOAuthFlow = async () => {
    setIsRunning(true);
    setCurrentStep(0);

    // Reset all steps
    const resetSteps = flowSteps.map(step => ({
      ...step,
      status: 'pending' as const,
      timestamp: '',
    }));
    setFlowSteps(resetSteps);

    // Simulate each step with delay
    for (let i = 0; i < flowSteps.length; i++) {
      setCurrentStep(i);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setFlowSteps(prev => {
        const updated = [...prev];
        updated[i] = {
          ...updated[i],
          status: 'in-progress',
          timestamp: new Date().toLocaleTimeString('vi-VN'),
        };
        return updated;
      });

      await new Promise(resolve => setTimeout(resolve, 1000));

      setFlowSteps(prev => {
        const updated = [...prev];
        updated[i] = {
          ...updated[i],
          status: 'completed',
        };
        return updated;
      });
    }

    setIsRunning(false);
  };

  const getStatusColor = (status: FlowStep['status']) => {
    switch (status) {
      case 'pending': return '#999';
      case 'in-progress': return '#FFA500';
      case 'completed': return '#34A853';
      case 'error': return '#EA4335';
      default: return '#999';
    }
  };

  const getStatusIcon = (status: FlowStep['status']) => {
    switch (status) {
      case 'pending': return '⚪';
      case 'in-progress': return '🔄';
      case 'completed': return '✅';
      case 'error': return '❌';
      default: return '⚪';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>OAuth Flow Visualizer</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, isRunning && styles.buttonDisabled]}
          onPress={simulateOAuthFlow}
          disabled={isRunning}
        >
          <Text style={styles.buttonText}>
            {isRunning ? '🔄 Running...' : '▶️ Start OAuth Flow'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.timeline}>
        {flowSteps.map((step, index) => (
          <View key={step.id} style={styles.stepContainer}>
            <View style={styles.stepIndicator}>
              <Text style={styles.stepIcon}>{getStatusIcon(step.status)}</Text>
              {index < flowSteps.length - 1 && (
                <View 
                  style={[
                    styles.connector, 
                    { backgroundColor: getStatusColor(step.status) }
                  ]} 
                />
              )}
            </View>

            <View style={[styles.stepContent, currentStep === index && isRunning && styles.stepActive]}>
              <View style={styles.stepHeader}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                {step.timestamp && (
                  <Text style={styles.timestamp}>{step.timestamp}</Text>
                )}
              </View>
              
              <Text style={styles.stepDescription}>{step.description}</Text>

              {step.payload && step.status === 'completed' && (
                <View style={styles.payload}>
                  <Text style={styles.payloadTitle}>📦 Payload:</Text>
                  <Text style={styles.payloadContent}>
                    {JSON.stringify(step.payload, null, 2)}
                  </Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      {isRunning && (
        <View style={styles.progress}>
          <Text style={styles.progressText}>
            Step {currentStep + 1} / {flowSteps.length}
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${((currentStep + 1) / flowSteps.length) * 100}%` }
              ]} 
            />
          </View>
        </View>
      )}
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
  controls: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  button: {
    backgroundColor: '#4285F4',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  timeline: {
    flex: 1,
    padding: 16,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepIndicator: {
    alignItems: 'center',
    marginRight: 16,
  },
  stepIcon: {
    fontSize: 24,
    width: 32,
    height: 32,
    textAlign: 'center',
  },
  connector: {
    width: 2,
    flex: 1,
    marginTop: 4,
  },
  stepContent: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  stepActive: {
    borderColor: '#FFA500',
    borderWidth: 2,
    shadowColor: '#FFA500',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  stepDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  payload: {
    marginTop: 12,
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#4285F4',
  },
  payloadTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  payloadContent: {
    fontSize: 11,
    color: '#666',
    fontFamily: 'monospace',
  },
  progress: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4285F4',
  },
});
