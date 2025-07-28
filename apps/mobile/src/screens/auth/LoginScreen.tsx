import React, { useState } from 'react';
import {
  YStack,
  XStack,
  Heading,
  Text,
  Button,
  Input,
  Card,
  CardContent,
} from '@lottopass/ui';
import { useLogin } from '@lottopass/api-client';
import { useAuthStore, useUIStore } from '@lottopass/stores';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAvoidingView, Platform } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  
  const { mutate: login, isPending } = useLogin();
  const { login: setAuth } = useAuthStore();
  const { showToast } = useUIStore();

  const validateForm = () => {
    const newErrors = { email: '', password: '' };
    
    if (!email) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다';
    }
    
    if (!password) {
      newErrors.password = '비밀번호를 입력해주세요';
    }
    
    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleLogin = () => {
    if (!validateForm()) return;

    login(
      { email, password },
      {
        onSuccess: (data) => {
          setAuth(data.user, data.tokens);
          showToast({
            type: 'success',
            message: '로그인되었습니다!',
          });
          navigation.goBack();
        },
        onError: (error: any) => {
          showToast({
            type: 'error',
            message: error.message || '로그인에 실패했습니다.',
          });
        },
      }
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <YStack flex={1} backgroundColor="$background" padding="$4" gap="$4">
        <YStack gap="$2" marginTop="$4">
          <Heading level={3}>로그인</Heading>
          <Text color="muted">
            계정에 로그인하여 더 많은 기능을 이용하세요
          </Text>
        </YStack>

        <Card>
          <CardContent>
            <YStack gap="$4">
              {/* Email Input */}
              <YStack gap="$2">
                <Text weight="medium">이메일</Text>
                <Input
                  placeholder="email@example.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  status={errors.email ? 'error' : undefined}
                  fullWidth
                />
                {errors.email && (
                  <Text variant="caption" color="danger">
                    {errors.email}
                  </Text>
                )}
              </YStack>

              {/* Password Input */}
              <YStack gap="$2">
                <Text weight="medium">비밀번호</Text>
                <Input
                  placeholder="비밀번호 입력"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  status={errors.password ? 'error' : undefined}
                  fullWidth
                />
                {errors.password && (
                  <Text variant="caption" color="danger">
                    {errors.password}
                  </Text>
                )}
              </YStack>

              {/* Forgot Password */}
              <XStack justifyContent="flex-end">
                <Text
                  variant="caption"
                  color="primary"
                  onPress={() => {}}
                >
                  비밀번호를 잊으셨나요?
                </Text>
              </XStack>
            </YStack>
          </CardContent>
        </Card>

        {/* Login Button */}
        <Button
          size="large"
          variant="primary"
          onPress={handleLogin}
          disabled={isPending}
          fullWidth
        >
          {isPending ? '로그인 중...' : '로그인'}
        </Button>

        {/* Social Login */}
        <YStack gap="$3">
          <XStack alignItems="center" gap="$3">
            <YStack flex={1} height={1} backgroundColor="$borderColor" />
            <Text variant="caption" color="muted">또는</Text>
            <YStack flex={1} height={1} backgroundColor="$borderColor" />
          </XStack>

          <Button
            size="large"
            variant="ghost"
            fullWidth
            onPress={() => {}}
          >
            카카오로 로그인
          </Button>

          <Button
            size="large"
            variant="ghost"
            fullWidth
            onPress={() => {}}
          >
            Apple로 로그인
          </Button>
        </YStack>

        {/* Sign Up Link */}
        <XStack justifyContent="center" gap="$2" marginTop="auto">
          <Text color="muted">계정이 없으신가요?</Text>
          <Text
            color="primary"
            weight="medium"
            onPress={() => navigation.navigate('Signup')}
          >
            회원가입
          </Text>
        </XStack>
      </YStack>
    </KeyboardAvoidingView>
  );
}