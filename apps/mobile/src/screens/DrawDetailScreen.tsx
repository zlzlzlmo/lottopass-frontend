import React from 'react';
import {
  YStack,
  XStack,
  ScrollView,
  Heading,
  Text,
  Card,
  CardHeader,
  CardContent,
  Spinner,
  Button,
} from '@lottopass/ui';
import { LottoBall } from '@lottopass/ui';
import { useDrawByNumber } from '@lottopass/api-client';
import { formatDate, formatPrize } from '@lottopass/shared';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

type RouteType = RouteProp<RootStackParamList, 'DrawDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function DrawDetailScreen() {
  const route = useRoute<RouteType>();
  const navigation = useNavigation<NavigationProp>();
  const { drawNumber } = route.params;
  
  const { data: draw, isLoading, error } = useDrawByNumber(drawNumber);

  if (isLoading) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center">
        <Spinner size="large" />
      </YStack>
    );
  }

  if (error || !draw) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" padding="$4">
        <Text color="danger">회차 정보를 불러올 수 없습니다.</Text>
      </YStack>
    );
  }

  const numbers = [
    draw.drwtNo1,
    draw.drwtNo2,
    draw.drwtNo3,
    draw.drwtNo4,
    draw.drwtNo5,
    draw.drwtNo6,
  ];

  const totalPrize = draw.firstWinamnt * draw.firstPrzwnerCo;

  return (
    <ScrollView flex={1} backgroundColor="$background">
      <YStack padding="$4" gap="$4">
        {/* Draw Info */}
        <Card variant="elevated">
          <CardHeader>
            <YStack gap="$2">
              <Heading level={4}>제 {draw.drwNo}회</Heading>
              <Text variant="caption" color="muted">
                추첨일: {formatDate(draw.drwNoDate)}
              </Text>
            </YStack>
          </CardHeader>
          <CardContent>
            <YStack gap="$4">
              {/* Winning Numbers */}
              <YStack gap="$2" alignItems="center">
                <Text weight="medium">당첨 번호</Text>
                <XStack gap="$2" flexWrap="wrap" justifyContent="center">
                  {numbers.map((number, index) => (
                    <LottoBall key={index} number={number} size="large" />
                  ))}
                  <XStack alignItems="center" gap="$2">
                    <Text size="$6" color="muted">+</Text>
                    <LottoBall number={draw.bnusNo} size="large" isBonus />
                  </XStack>
                </XStack>
              </YStack>

              {/* Simulate Button */}
              <Button
                variant="secondary"
                onPress={() => navigation.navigate('Simulation', { numbers })}
                fullWidth
              >
                이 번호로 시뮬레이션
              </Button>
            </YStack>
          </CardContent>
        </Card>

        {/* Prize Info */}
        <Card>
          <CardHeader>
            <Heading level={5}>당첨 정보</Heading>
          </CardHeader>
          <CardContent>
            <YStack gap="$3">
              <YStack gap="$2">
                <XStack justifyContent="space-between">
                  <Text variant="label">총 판매액</Text>
                  <Text weight="semibold">{formatPrize(draw.totSellamnt)}</Text>
                </XStack>
                <XStack justifyContent="space-between">
                  <Text variant="label">총 당첨금</Text>
                  <Text weight="semibold">{formatPrize(totalPrize)}</Text>
                </XStack>
              </YStack>

              <YStack gap="$2" paddingTop="$2" borderTopWidth={1} borderTopColor="$borderColorWeak">
                <Text weight="medium" marginBottom="$1">1등 당첨 정보</Text>
                <XStack justifyContent="space-between">
                  <Text variant="label">당첨자 수</Text>
                  <Text weight="semibold">{draw.firstPrzwnerCo}명</Text>
                </XStack>
                <XStack justifyContent="space-between">
                  <Text variant="label">1인당 당첨금</Text>
                  <Text weight="semibold" color="primary">
                    {formatPrize(draw.firstWinamnt)}
                  </Text>
                </XStack>
                <XStack justifyContent="space-between">
                  <Text variant="label">총 누적 당첨금</Text>
                  <Text weight="semibold">{formatPrize(draw.firstAccumamnt)}</Text>
                </XStack>
              </YStack>
            </YStack>
          </CardContent>
        </Card>

        {/* Navigation */}
        <XStack gap="$3">
          <Button
            flex={1}
            variant="ghost"
            onPress={() => {
              if (drawNumber > 1) {
                navigation.setParams({ drawNumber: drawNumber - 1 });
              }
            }}
            disabled={drawNumber <= 1}
          >
            이전 회차
          </Button>
          <Button
            flex={1}
            variant="ghost"
            onPress={() => {
              navigation.setParams({ drawNumber: drawNumber + 1 });
            }}
          >
            다음 회차
          </Button>
        </XStack>
      </YStack>
    </ScrollView>
  );
}