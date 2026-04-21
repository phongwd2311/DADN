import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

import { Platform } from 'react-native';

const DEV_MACHINE_IP = '192.168.88.138';
const BASE_URL = Platform.select({
  web: 'http://localhost:3000/api',      
  ios: 'http://localhost:3000/api',     
  android: 'http://10.0.2.2:3000/api', 
  default: `http://${DEV_MACHINE_IP}:3000/api`,
});

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const TOKEN_KEY = 'GEARDRIVE_AUTH_TOKEN';

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
