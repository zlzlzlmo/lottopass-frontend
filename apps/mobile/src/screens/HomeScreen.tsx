import React, { useEffect, useState } from 'react';
import { RefreshControl } from 'react-native';
import { 
  YStack, 
  ScrollView, 
  Heading, 
  Text, 
  Button, 
  Card, 
  CardHeader, 
  CardContent,
  XStack,
  Spinner
} from '@lottopass/ui';
import { LottoBall } from '@lottopass/ui';
import { useLatestDraw } from '@lottopass/api-client';
import { formatDate, formatPrize, formatTimeUntilDraw } from '@lottopass/shared';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { data: latestDraw, isLoading, refetch } = useLatestDraw();
  const [timeUntilDraw, setTimeUntilDraw] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      setTimeUntilDraw(formatTimeUntilDraw());
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  if (isLoading && !refreshing) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center">
        <Spinner size="large" />
      </YStack>
    );
  }

  const numbers = latestDraw ? [
    latestDraw.drwtNo1,
    latestDraw.drwtNo2,
    latestDraw.drwtNo3,
    latestDraw.drwtNo4,
    latestDraw.drwtNo5,
    latestDraw.drwtNo6,
  ] : [];

  return (
    <ScrollView
      flex={1}
      backgroundColor="$background"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <YStack padding="$4" gap="$4">
        {/* Hero Section */}
        <Card backgroundColor="$primary" padding="$6">
          <YStack gap="$3" alignItems="center">
            <Heading level={3} color="white" textAlign="center">
              당신의 행운을 찾아드립니다
            </Heading>
            <Text color="white" opacity={0.9} textAlign="center">
              AI 기반 번호 분석과 통계로 더 스마트한 로또 번호를 생성하세요
            </Text>
            {timeUntilDraw && (
              <YStack
                backgroundColor="rgba(255,255,255,0.2)"
                paddingHorizontal="$4"
                paddingVertical="$2"
                borderRadius="$4"
              >
                <Text color="white" weight="semibold">
                  다음 추첨까지 {timeUntilDraw}
                </Text>
              </YStack>
            )}
          </YStack>
        </Card>

        {/* Latest Draw */}
        {latestDraw && (
          <Card variant="elevated">
            <CardHeader>
              <XStack justifyContent="space-between" alignItems="center">
                <Heading level={5}>제 {latestDraw.drwNo}회 당첨번호</Heading>
                <Text variant="caption" color="muted">
                  {formatDate(latestDraw.drwNoDate)}
                </Text>
              </XStack>
            </CardHeader>
            <CardContent>
              <YStack gap="$4">
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <XStack gap="$2" paddingVertical="$2">
                    {numbers.map((number, index) => (
                      <LottoBall key={index} number={number} size="medium" />
                    ))}
                    <XStack alignItems="center" gap="$2">
                      <Text size="$5" color="muted">+</Text>
                      <LottoBall number={latestDraw.bnusNo} size="medium" isBonus />
                    </XStack>
                  </XStack>
                </ScrollView>

                <YStack gap="$2" paddingTop="$2">
                  <XStack justifyContent="space-between">
                    <Text variant="label">1등 당첨금</Text>
                    <Text weight="semibold">{formatPrize(latestDraw.firstWinamnt)}</Text>
                  </XStack>
                  <XStack justifyContent="space-between">
                    <Text variant="label">1등 당첨자</Text>
                    <Text weight="semibold">{latestDraw.firstPrzwnerCo}명</Text>
                  </XStack>
                </YStack>

                <Button
                  size="small"
                  variant="ghost"
                  onPress={() => navigation.navigate('DrawDetail', { drawNumber: latestDraw.drwNo })}
                >
                  상세보기
                </Button>
              </YStack>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <YStack gap="$3">
          <Heading level={5}>빠른 메뉴</Heading>
          <XStack gap="$3" flexWrap="wrap">
            <Card
              interactive
              onPress={() => navigation.navigate('Main', { screen: 'NumberGeneration' })}
              flex={1}
              minWidth={140}
            >
              <CardContent>
                <YStack gap="$2" alignItems="center" paddingVertical="$3">
                  <Text fontSize="$8">🎲</Text>
                  <Text weight="medium">번호 생성</Text>
                </YStack>
              </CardContent>
            </Card>

            <Card
              interactive
              onPress={() => navigation.navigate('Main', { screen: 'Statistics' })}
              flex={1}
              minWidth={140}
            >
              <CardContent>
                <YStack gap="$2" alignItems="center" paddingVertical="$3">
                  <Text fontSize="$8">📊</Text>
                  <Text weight="medium">통계 분석</Text>
                </YStack>
              </CardContent>
            </Card>

            <Card
              interactive
              onPress={() => navigation.navigate('Main', { screen: 'Stores' })}
              flex={1}
              minWidth={140}
            >
              <CardContent>
                <YStack gap="$2" alignItems="center" paddingVertical="$3">
                  <Text fontSize="$8">🏪</Text>
                  <Text weight="medium">판매점 찾기</Text>
                </YStack>
              </CardContent>
            </Card>
          </XStack>
        </YStack>
      </YStack>
    </ScrollView>
  );
}