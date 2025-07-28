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
  Checkbox,
  Label,
} from '@lottopass/ui';
import { useSignup } from '@lottopass/api-client';
import { useAuthStore, useUIStore } from '@lottopass/stores';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SignupScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
  });
  
  const { mutate: signup, isPending } = useSignup();
  const { login: setAuth } = useAuthStore();
  const { showToast } = useUIStore();

  const validateForm = () => {
    const newErrors = {
      email: '',
      password: '',
      confirmPassword: '',
      nickname: '',
    };
    
    // Email validation
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)) {
      newErrors.password = '대소문자, 숫자, 특수문자를 포함해야 합니다';
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    }
    
    // Nickname validation
    if (!formData.nickname) {
      newErrors.nickname = '닉네임을 입력해주세요';
    } else if (formData.nickname.length < 2 || formData.nickname.length > 20) {
      newErrors.nickname = '닉네임은 2-20자 사이여야 합니다';
    }
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSignup = () => {
    if (!validateForm()) return;
    
    if (!agreedToTerms) {
      showToast({
        type: 'error',
        message: '이용약관에 동의해주세요',
      });
      return;
    }

    signup(
      formData,
      {
        onSuccess: (data) => {
          setAuth(data.user, data.tokens);
          showToast({
            type: 'success',
            message: '회원가입이 완료되었습니다!',
          });
          navigation.navigate('Main');
        },
        onError: (error: any) => {
          showToast({
            type: 'error',
            message: error.message || '회원가입에 실패했습니다.',
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
      <ScrollView flex={1} backgroundColor="$background">
        <YStack padding="$4" gap="$4">
          <YStack gap="$2" marginTop="$4">
            <Heading level={3}>회원가입</Heading>
            <Text color="muted">
              계정을 만들고 LottoPass의 모든 기능을 이용하세요
            </Text>
          </YStack>

          <Card>
            <CardContent>
              <YStack gap="$4">
                {/* Email */}
                <YStack gap="$2">
                  <Text weight="medium">이메일</Text>
                  <Input
                    placeholder="email@example.com"
                    value={formData.email}
                    onChangeText={(text) => setFormData({ ...formData, email: text })}
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

                {/* Nickname */}
                <YStack gap="$2">
                  <Text weight="medium">닉네임</Text>
                  <Input
                    placeholder="닉네임 입력 (2-20자)"
                    value={formData.nickname}
                    onChangeText={(text) => setFormData({ ...formData, nickname: text })}
                    status={errors.nickname ? 'error' : undefined}
                    fullWidth
                  />
                  {errors.nickname && (
                    <Text variant="caption" color="danger">
                      {errors.nickname}
                    </Text>
                  )}
                </YStack>

                {/* Password */}
                <YStack gap="$2">
                  <Text weight="medium">비밀번호</Text>
                  <Input
                    placeholder="비밀번호 입력 (8자 이상)"
                    value={formData.password}
                    onChangeText={(text) => setFormData({ ...formData, password: text })}
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

                {/* Confirm Password */}
                <YStack gap="$2">
                  <Text weight="medium">비밀번호 확인</Text>
                  <Input
                    placeholder="비밀번호 재입력"
                    value={formData.confirmPassword}
                    onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                    secureTextEntry
                    status={errors.confirmPassword ? 'error' : undefined}
                    fullWidth
                  />
                  {errors.confirmPassword && (
                    <Text variant="caption" color="danger">
                      {errors.confirmPassword}
                    </Text>
                  )}
                </YStack>
              </YStack>
            </CardContent>
          </Card>

          {/* Terms Agreement */}
          <Card>
            <CardContent>
              <XStack gap="$3" alignItems="center">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                />
                <Label htmlFor="terms" flex={1}>
                  <Text variant="caption">
                    <Text variant="caption" color="primary" onPress={() => {}}>
                      이용약관
                    </Text>
                    {' 및 '}
                    <Text variant="caption" color="primary" onPress={() => {}}>
                      개인정보처리방침
                    </Text>
                    에 동의합니다
                  </Text>
                </Label>
              </XStack>
            </CardContent>
          </Card>

          {/* Sign Up Button */}
          <Button
            size="large"
            variant="primary"
            onPress={handleSignup}
            disabled={isPending || !agreedToTerms}
            fullWidth
          >
            {isPending ? '가입 중...' : '회원가입'}
          </Button>

          {/* Login Link */}
          <XStack justifyContent="center" gap="$2">
            <Text color="muted">이미 계정이 있으신가요?</Text>
            <Text
              color="primary"
              weight="medium"
              onPress={() => navigation.navigate('Login')}
            >
              로그인
            </Text>
          </XStack>
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}