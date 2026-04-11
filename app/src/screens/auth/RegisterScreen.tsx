import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../utils/theme';
import CustomInput from '../../components/CustomInput';
import GradientButton from '../../components/GradientButton';
import { AuthContext } from '../../context/AuthContext';
import { authApi } from '../../api/authApi';

const RegisterScreen = ({ navigation }: any) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ fullName?: string; email?: string; password?: string; confirmPassword?: string }>({});

  const validate = () => {
    const newErrors: { fullName?: string; email?: string; password?: string; confirmPassword?: string } = {};
    if (!fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';
    
    if (!password.trim()) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { login } = React.useContext(AuthContext);

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    setErrors({ fullName: '', email: '', password: '', confirmPassword: '' });

    try {
      const data = await authApi.register(fullName, email, password);
      // login automatically after register
      await login(data.token, data.user);
    } catch (error: any) {
      console.log('Register error', error?.response?.data || error.message);
      setErrors({ 
        email: error?.response?.data?.error || 'Đăng ký thất bại. Vui lòng thử lại.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.logoContainer}>
              <View style={styles.logoBg}>
                <Ionicons name="settings-outline" size={28} color="#fff" />
              </View>
            </View>
            <Text style={styles.appTitle}>DriveCalc</Text>
            <Text style={styles.appSubtitle}>
              Hệ thống tính toán và gợi ý thiết bị công nghiệp
            </Text>
          </View>

          {/* Auth Card */}
          <View style={[styles.authCard, Shadows.card]}>
            {/* Tabs */}
            <View style={styles.tabContainer}>
              <TouchableOpacity 
                style={styles.inactiveTab}
                onPress={() => navigation.replace('Login')}
              >
                <Text style={styles.inactiveTabText}>Đăng nhập</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.activeTab}>
                <Text style={styles.activeTabText}>Đăng ký</Text>
              </TouchableOpacity>
            </View>

            {/* Form */}
            <View style={styles.formContainer}>
              <CustomInput
                label="Họ và tên"
                value={fullName}
                onChangeText={setFullName}
                placeholder="Nguyễn Văn A"
                error={errors.fullName}
              />

              <CustomInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="email@example.com"
                keyboardType="email-address"
                error={errors.email}
              />

              <CustomInput
                label="Mật khẩu"
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                secureTextEntry
                error={errors.password}
              />

              <CustomInput
                label="Xác nhận mật khẩu"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="••••••••"
                secureTextEntry
                error={errors.confirmPassword}
              />

              <GradientButton
                title="Đăng ký"
                onPress={handleRegister}
                loading={loading}
                style={styles.registerBtnWrapper}
                icon={<Ionicons name="person-add-outline" size={20} color="#fff" />}
              />

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>hoặc</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Google Button */}
              <TouchableOpacity style={styles.googleButton}>
                <Ionicons name="logo-google" size={20} color={Colors.textPrimary} style={styles.googleIcon} />
                <Text style={styles.googleButtonText}>Tiếp tục với Google</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footerSection}>
            <Text style={styles.footerText}>
              Bằng việc đăng ký, bạn đồng ý với{' '}
              <Text style={styles.linkText}>Điều khoản dịch vụ</Text> và{' '}
              <Text style={styles.linkText}>Chính sách bảo mật</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxxl,
    paddingBottom: Spacing.xl,
    alignItems: 'center',
  },

  // Header
  headerSection: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  logoContainer: {
    marginBottom: Spacing.md,
  },
  logoBg: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.glow(Colors.primary),
  },
  appTitle: {
    ...Typography.h1,
    color: Colors.primaryDark,
    marginBottom: Spacing.xs,
  },
  appSubtitle: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  // Auth Card
  authCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.xl,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.sm,
    padding: 4,
  },
  activeTab: {
    flex: 1,
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm - 2,
    alignItems: 'center',
    ...Shadows.card,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  inactiveTab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inactiveTabText: {
    color: Colors.textSecondary,
    fontWeight: '500',
    fontSize: 14,
  },

  // Form
  formContainer: {
    width: '100%',
  },
  registerBtnWrapper: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },

  // Divider
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    color: Colors.textMuted,
    paddingHorizontal: Spacing.md,
    fontSize: 13,
  },

  // Google Button
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
  },
  googleIcon: {
    marginRight: Spacing.sm,
  },
  googleButtonText: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },

  // Footer
  footerSection: {
    marginTop: 'auto',
    paddingTop: Spacing.md,
  },
  footerText: {
    color: Colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  linkText: {
    color: Colors.primary,
  },
});

export default RegisterScreen;
