import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// THAY ĐỔI IP ADDRESS NÀY BẰNG IP MÁY TÍNH CỦA BẠN
// Chạy 'ipconfig' để lấy IPv4 Address của máy bạn
const API_BASE_URL = 'http://192.168.123.12:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor - Tự động thêm Bearer token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token from storage:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Xử lý lỗi 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired hoặc invalid
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('userInfo');
      console.log('Token expired, please login again');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
