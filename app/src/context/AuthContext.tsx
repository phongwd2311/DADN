import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { TOKEN_KEY } from '../api/client';
import { authApi } from '../api/authApi';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

import { Platform } from 'react-native';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Khởi động app: Kiểm tra xem đã có token chưa
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        let token = null;
        if (Platform.OS === 'web') {
          token = localStorage.getItem(TOKEN_KEY);
        } else {
          token = await SecureStore.getItemAsync(TOKEN_KEY);
        }

        if (token) {
          const data = await authApi.getMe();
          setUser(data.user);
        }
      } catch (e) {
        console.log("Không thể tự động đăng nhập", e);
        if (Platform.OS === 'web') {
          localStorage.removeItem(TOKEN_KEY);
        } else {
          await SecureStore.deleteItemAsync(TOKEN_KEY);
        }
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  const login = async (token: string, userData: User) => {
    if (Platform.OS === 'web') {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    }
    setUser(userData);
  };

  const logout = async () => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(TOKEN_KEY);
    } else {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
