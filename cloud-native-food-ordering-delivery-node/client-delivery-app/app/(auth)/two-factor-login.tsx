import { useState } from 'react';
import { View, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  useTheme,
  Card,
  IconButton,
  SegmentedButtons,
} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { sendOTP, verifyOTP, loginUser } from '../../services/api';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().when('method', {
    is: 'password',
    then: Yup.string().required('Password is required'),
    otherwise: Yup.string(),
  }),
  otp: Yup.string().when('step', {
    is: 2,
    then: Yup.string().length(6, 'OTP must be 6 digits').required('OTP is required'),
    otherwise: Yup.string(),
  }),
});

export default function TwoFactorLoginScreen() {
  const { login } = useAuth();
  const [step, setStep] = useState(1); // Step 1: Email/Password, Step 2: OTP
  const [method, setMethod] = useState('password'); // 'password' or 'otp'
  const [loading, setLoading] = useState(false);
  const [sendingOTP, setSendingOTP] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const { colors } = useTheme();

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOTP = async (values: { email: string }) => {
    try {
      setSendingOTP(true);
      await sendOTP(values.email);
      Toast.show({
        type: 'success',
        text1: 'OTP Sent',
        text2: 'Check your email for the verification code',
        position: 'bottom',
      });
      setStep(2);
      startCountdown();
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Failed',
        text2: error.message || 'Failed to send OTP',
        position: 'bottom',
      });
    } finally {
      setSendingOTP(false);
    }
  };

  const handlePasswordLogin = async (values: { email: string; password: string }) => {
    try {
      setLoading(true);
      const user = await login(values);

      if (user.role === 'delivery') {
        if (user.status === 'pending_approval') {
          router.replace('/(auth)/pending-approval');
        } else {
          router.replace('/(delivery)/dashboard');
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'Access Restricted',
          text2: 'Only delivery partners can login through this app',
          position: 'bottom',
        });
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: error.message || 'Invalid Username or Password',
        position: 'bottom',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (values: { email: string; otp: string }) => {
    try {
      setLoading(true);
      const result = await verifyOTP(values.email, values.otp);

      if (result.user?.role === 'delivery') {
        if (result.user.status === 'pending_approval') {
          router.replace('/(auth)/pending-approval');
        } else {
          router.replace('/(delivery)/dashboard');
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'Access Restricted',
          text2: 'Only delivery partners can login through this app',
          position: 'bottom',
        });
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Verification Failed',
        text2: error.message || 'Invalid OTP',
        position: 'bottom',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async (email: string) => {
    if (countdown > 0) return;

    try {
      setSendingOTP(true);
      await sendOTP(email);
      Toast.show({
        type: 'success',
        text1: 'OTP Resent',
        text2: 'Check your email for the new verification code',
        position: 'bottom',
      });
      startCountdown();
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Failed',
        text2: error.message || 'Failed to resend OTP',
        position: 'bottom',
      });
    } finally {
      setSendingOTP(false);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Delivery Person Image (Background) */}
        <Image
          source={require('../../assets/images/Delivery_Guy.png')}
          style={styles.deliveryImage}
          resizeMode="contain"
        />

        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.logoContainer}>
              <MaterialCommunityIcons
                name="shield-check"
                size={48}
                color={colors.primary}
              />
              <Text variant="headlineMedium" style={styles.title}>
                Delivery Partner
              </Text>
              <Text variant="bodyMedium" style={styles.subtitle}>
                {step === 1 ? 'Sign in to your account' : 'Verify your identity'}
              </Text>
            </View>

            {step === 1 ? (
              <>
                {/* Method Selection */}
                <SegmentedButtons
                  value={method}
                  onValueChange={setMethod}
                  buttons={[
                    {
                      value: 'password',
                      label: 'Password',
                      icon: 'lock',
                    },
                    {
                      value: 'otp',
                      label: 'OTP',
                      icon: 'email',
                    },
                  ]}
                  style={styles.segmentedButtons}
                />

                <Formik
                  initialValues={{ email: '', password: '', otp: '', method, step }}
                  validationSchema={validationSchema}
                  onSubmit={method === 'password' ? handlePasswordLogin : handleSendOTP}
                >
                  {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    errors,
                    touched,
                  }) => (
                    <>
                      <TextInput
                        mode="outlined"
                        label="Email"
                        placeholder="Enter your email"
                        onChangeText={handleChange('email')}
                        onBlur={handleBlur('email')}
                        value={values.email}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        error={touched.email && !!errors.email}
                        style={styles.input}
                        left={<TextInput.Icon icon="email" />}
                      />
                      {touched.email && errors.email && (
                        <Text style={styles.error}>{errors.email}</Text>
                      )}

                      {method === 'password' && (
                        <>
                          <TextInput
                            mode="outlined"
                            label="Password"
                            placeholder="Enter your password"
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            value={values.password}
                            secureTextEntry={secureTextEntry}
                            error={touched.password && !!errors.password}
                            style={styles.input}
                            left={<TextInput.Icon icon="lock" />}
                            right={
                              <TextInput.Icon
                                icon={secureTextEntry ? 'eye-off' : 'eye'}
                                onPress={() => setSecureTextEntry(!secureTextEntry)}
                              />
                            }
                          />
                          {touched.password && errors.password && (
                            <Text style={styles.error}>{errors.password}</Text>
                          )}
                        </>
                      )}

                      <Button
                        mode="contained"
                        onPress={() => handleSubmit()}
                        loading={loading || sendingOTP}
                        disabled={loading || sendingOTP}
                        style={styles.button}
                        labelStyle={styles.buttonLabel}
                      >
                        {loading || sendingOTP
                          ? 'Processing...'
                          : method === 'password'
                          ? 'Sign In'
                          : 'Send OTP'}
                      </Button>
                    </>
                  )}
                </Formik>

                <View style={styles.footer}>
                  <Text variant="bodyMedium" style={styles.footerText}>
                    Don't have an account?
                  </Text>
                  <Button
                    mode="text"
                    onPress={() => router.push('/(auth)/delivery-register')}
                    compact
                    labelStyle={styles.registerButton}
                  >
                    Register Now
                  </Button>
                </View>
              </>
            ) : (
              <>
                <Button
                  mode="outlined"
                  onPress={handleBack}
                  style={styles.backButton}
                  icon="arrow-left"
                >
                  Back
                </Button>

                <Text variant="bodyMedium" style={styles.otpInfo}>
                  Enter 6-digit code sent to your email
                </Text>

                <Formik
                  initialValues={{ email: '', otp: '', step }}
                  validationSchema={validationSchema}
                  onSubmit={handleVerifyOTP}
                >
                  {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    errors,
                    touched,
                  }) => (
                    <>
                      <TextInput
                        mode="outlined"
                        label="OTP"
                        placeholder="Enter 6-digit OTP"
                        onChangeText={handleChange('otp')}
                        onBlur={handleBlur('otp')}
                        value={values.otp}
                        keyboardType="number-pad"
                        maxLength={6}
                        error={touched.otp && !!errors.otp}
                        style={styles.input}
                        left={<TextInput.Icon icon="numeric" />}
                      />
                      {touched.otp && errors.otp && (
                        <Text style={styles.error}>{errors.otp}</Text>
                      )}

                      <Button
                        mode="contained"
                        onPress={() => handleSubmit()}
                        loading={loading}
                        disabled={loading || values.otp.length !== 6}
                        style={styles.button}
                        labelStyle={styles.buttonLabel}
                      >
                        {loading ? 'Verifying...' : 'Verify OTP'}
                      </Button>

                      <Button
                        mode="text"
                        onPress={() => handleResendOTP(values.email)}
                        disabled={countdown > 0 || sendingOTP}
                        style={styles.resendButton}
                        labelStyle={styles.resendButtonLabel}
                      >
                        {sendingOTP
                          ? 'Sending...'
                          : countdown > 0
                          ? `Resend in ${countdown}s`
                          : 'Resend OTP'}
                      </Button>
                    </>
                  )}
                </Formik>
              </>
            )}
          </Card.Content>
        </Card>
      </ScrollView>
      <Toast />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 25,
    position: 'relative',
  },
  deliveryImage: {
    position: 'absolute',
    width: '60%',
    height: '40%',
    bottom: '67%',
    opacity: 0.8,
    left: '5%',
    zIndex: 0,
  },
  card: {
    top: '5%',
    paddingVertical: 24,
    borderRadius: 16,
    elevation: 4,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    marginTop: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Roboto',
  },
  subtitle: {
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.6,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 8,
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 12,
    marginLeft: 4,
  },
  button: {
    marginTop: 16,
    paddingVertical: 6,
    borderRadius: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'SpaceMono-Regular',
  },
  backButton: {
    marginBottom: 16,
  },
  otpInfo: {
    textAlign: 'center',
    marginBottom: 16,
    opacity: 0.7,
  },
  resendButton: {
    marginTop: 8,
  },
  resendButtonLabel: {
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 11,
    opacity: 0.6,
    fontFamily: 'Poppins_400Regular',
  },
  registerButton: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: 'bold',
    fontFamily: 'Poppins_600SemiBold',
  },
});
