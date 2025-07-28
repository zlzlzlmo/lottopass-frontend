import React from 'react';
import {
  YStack,
  XStack,
  ScrollView,
  Heading,
  Text,
  Card,
  CardContent,
  Button,
  Avatar,
  Separator,
  Switch,
} from '@lottopass/ui';
import { useAuthStore, useUIStore } from '@lottopass/stores';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ProfileScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { theme, setTheme, showToast } = useUIStore();

  const handleLogout = () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃 하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '로그아웃',
          style: 'destructive',
          onPress: () => {
            logout();
            showToast({
              type: 'success',
              message: '로그아웃되었습니다.',
            });
          },
        },
      ]
    );
  };

  if (!isAuthenticated || !user) {
    return (
      <YStack flex={1} backgroundColor="$background" padding="$4" gap="$4">
        <Card>
          <CardContent>
            <YStack gap="$4" alignItems="center" paddingVertical="$4">
              <Text>로그인이 필요합니다.</Text>
              <Button
                variant="primary"
                onPress={() => navigation.navigate('Login')}
              >
                로그인하기
              </Button>
            </YStack>
          </CardContent>
        </Card>
      </YStack>
    );
  }

  return (
    <ScrollView flex={1} backgroundColor="$background">
      <YStack padding="$4" gap="$4">
        {/* User Info */}
        <Card>
          <CardContent>
            <XStack gap="$4" alignItems="center">
              <Avatar size="$8" circular>
                <Avatar.Image
                  source={{ uri: user.profileImage || 'https://i.pravatar.cc/150' }}
                />
                <Avatar.Fallback backgroundColor="$primary">
                  <Text color="white" fontSize="$6" weight="bold">
                    {user.nickname.charAt(0)}
                  </Text>
                </Avatar.Fallback>
              </Avatar>
              
              <YStack flex={1} gap="$1">
                <Heading level={5}>{user.nickname}</Heading>
                <Text variant="caption" color="muted">{user.email}</Text>
              </YStack>
            </XStack>
          </CardContent>
        </Card>

        {/* My Numbers */}
        <Card interactive onPress={() => {}}>
          <CardContent>
            <XStack justifyContent="space-between" alignItems="center">
              <YStack gap="$1">
                <Text weight="semibold">저장된 번호</Text>
                <Text variant="caption" color="muted">
                  내가 저장한 번호 조합 관리
                </Text>
              </YStack>
              <Text color="muted">→</Text>
            </XStack>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card interactive onPress={() => {}}>
          <CardContent>
            <XStack justifyContent="space-between" alignItems="center">
              <YStack gap="$1">
                <Text weight="semibold">나의 통계</Text>
                <Text variant="caption" color="muted">
                  번호 생성 기록 및 당첨 통계
                </Text>
              </YStack>
              <Text color="muted">→</Text>
            </XStack>
          </CardContent>
        </Card>

        <Separator marginVertical="$2" />

        {/* Settings */}
        <Heading level={6}>설정</Heading>

        <Card>
          <CardContent>
            <YStack gap="$4">
              {/* Dark Mode */}
              <XStack justifyContent="space-between" alignItems="center">
                <YStack gap="$1" flex={1}>
                  <Text weight="medium">다크 모드</Text>
                  <Text variant="caption" color="muted">
                    어두운 테마 사용
                  </Text>
                </YStack>
                <Switch
                  checked={theme === 'dark'}
                  onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                />
              </XStack>

              <Separator />

              {/* Notifications */}
              <XStack justifyContent="space-between" alignItems="center">
                <YStack gap="$1" flex={1}>
                  <Text weight="medium">알림 설정</Text>
                  <Text variant="caption" color="muted">
                    추첨 결과 및 당첨 알림
                  </Text>
                </YStack>
                <Switch
                  checked={user.preferences.notificationEnabled}
                  onCheckedChange={(checked) => {
                    // Update notification settings
                  }}
                />
              </XStack>

              <Separator />

              {/* Favorite Numbers */}
              <XStack justifyContent="space-between" alignItems="center">
                <YStack gap="$1" flex={1}>
                  <Text weight="medium">선호 번호 설정</Text>
                  <Text variant="caption" color="muted">
                    자주 사용할 번호 관리
                  </Text>
                </YStack>
                <Text color="muted">→</Text>
              </XStack>
            </YStack>
          </CardContent>
        </Card>

        {/* Account */}
        <Card>
          <CardContent>
            <YStack gap="$3">
              <Button
                variant="ghost"
                fullWidth
                onPress={() => {}}
              >
                비밀번호 변경
              </Button>
              
              <Button
                variant="ghost"
                fullWidth
                onPress={handleLogout}
              >
                로그아웃
              </Button>
              
              <Button
                variant="ghost"
                fullWidth
                color="$danger"
                onPress={() => {
                  Alert.alert(
                    '회원 탈퇴',
                    '정말 탈퇴하시겠습니까? 모든 데이터가 삭제됩니다.',
                    [
                      { text: '취소', style: 'cancel' },
                      {
                        text: '탈퇴',
                        style: 'destructive',
                        onPress: () => {
                          // Handle account deletion
                        },
                      },
                    ]
                  );
                }}
              >
                회원 탈퇴
              </Button>
            </YStack>
          </CardContent>
        </Card>

        {/* App Info */}
        <YStack alignItems="center" paddingVertical="$4" gap="$2">
          <Text variant="caption" color="muted">
            LottoPass v1.0.0
          </Text>
          <XStack gap="$4">
            <Text variant="caption" color="muted" onPress={() => {}}>
              이용약관
            </Text>
            <Text variant="caption" color="muted">|</Text>
            <Text variant="caption" color="muted" onPress={() => {}}>
              개인정보처리방침
            </Text>
          </XStack>
        </YStack>
      </YStack>
    </ScrollView>
  );
}