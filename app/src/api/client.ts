import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Lấy IP này để chạy trên máy thật trùng mạng wifi với máy tính (thay vì localhost)
const BASE_URL = 'http://172.16.1.206:3000/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const TOKEN_KEY = 'GEARDRIVE_AUTH_TOKEN';

import { Platform } from 'react-native';

// Interceptor: Trước khi gửi request, tự động lấy Token đút vào Header
apiClient.interceptors.request.use(
  async (config) => {
    try {
      let token = null;
      if (Platform.OS === 'web') {
        token = localStorage.getItem(TOKEN_KEY);
      } else {
        token = await SecureStore.getItemAsync(TOKEN_KEY);
      }
      
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn("Lỗi khi đọc token", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
