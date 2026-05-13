import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import PrimaryButton from '../../components/PrimaryButton';
import CustomInput from '../../components/CustomInput';
import { Colors, Typography, Spacing } from '../../utils/theme';
import { authApi } from '../../api';

const ForgotPasswordScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1: enter email, 2: enter token and new password

  const handleRequestToken = async () => {
    try {
      if (!email) {
        Alert.alert('Error', 'Please enter your email');
        return;
      }
      await authApi.forgotPassword(email);
      Alert.alert('Success', 'If this email is registered, a reset token has been sent.');
      setStep(2);
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to request password reset';
      Alert.alert('Error', msg);
    }
  };

  const handleResetPassword = async () => {
    try {
      if (!token || !newPassword) {
        Alert.alert('Error', 'Please enter both token and new password');
        return;
      }
      await authApi.resetPassword(token, newPassword);
      Alert.alert('Success', 'Password has been reset. Please login with your new password.');
      navigation.navigate('Login');
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to reset password';
      Alert.alert('Error', msg);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <LinearGradient
        colors={Colors.gradientBlue}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>
              {step === 1 ? 'Reset Password' : 'New Password'}
            </Text>
            <Text style={styles.subtitle}>
              {step === 1 
                ? 'Enter your email to receive a reset token'
                : 'Enter the token and your new password'}
            </Text>
          </View>

          <View style={styles.formContainer}>
            {step === 1 ? (
              <>
                <CustomInput
                  icon="mail-outline"
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                />
                <View style={styles.buttonContainer}>
                  <PrimaryButton title="Request Token" onPress={handleRequestToken} />
                </View>
              </>
            ) : (
              <>
                <CustomInput
                  icon="key-outline"
                  placeholder="Reset Token"
                  value={token}
                  onChangeText={setToken}
                />
                <CustomInput
                  icon="lock-closed-outline"
                  placeholder="New Password"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  isPassword
                />
                <View style={styles.buttonContainer}>
                  <PrimaryButton title="Update Password" onPress={handleResetPassword} />
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    marginTop: 50,
    marginLeft: Spacing.xl,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxl,
  },
  headerContainer: {
    marginBottom: Spacing.xxxl,
  },
  title: {
    ...Typography.h1,
    color: '#fff',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.bodyLarge,
    color: 'rgba(255,255,255,0.8)',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: Spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  buttonContainer: {
    marginTop: Spacing.lg,
  },
});

export default ForgotPasswordScreen;