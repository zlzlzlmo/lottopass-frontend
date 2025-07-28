'use client';

import { YStack, XStack, Card, CardHeader, CardContent, Heading, Text, Spinner } from '@lottopass/ui';
import { LottoBall } from '@lottopass/ui';
import { useLatestDraw } from '@lottopass/api-client';
import { formatDate, formatPrize } from '@lottopass/shared';

export function LatestDrawSection() {
  const { data: latestDraw, isLoading, error } = useLatestDraw();

  if (isLoading) {
    return (
      <Card>
        <YStack alignItems="center" justifyContent="center" height={200}>
          <Spinner size="large" />
        </YStack>
      </Card>
    );
  }

  if (error || !latestDraw) {
    return (
      <Card>
        <CardContent>
          <Text color="danger">최신 회차 정보를 불러올 수 없습니다.</Text>
        </CardContent>
      </Card>
    );
  }

  const numbers = [
    latestDraw.drwtNo1,
    latestDraw.drwtNo2,
    latestDraw.drwtNo3,
    latestDraw.drwtNo4,
    latestDraw.drwtNo5,
    latestDraw.drwtNo6,
  ];

  return (
    <Card variant="elevated">
      <CardHeader>
        <XStack justifyContent="space-between" alignItems="center">
          <Heading level={4}>제 {latestDraw.drwNo}회 당첨번호</Heading>
          <Text variant="caption" color="muted">
            {formatDate(latestDraw.drwNoDate)}
          </Text>
        </XStack>
      </CardHeader>
      
      <CardContent>
        <YStack gap="$4">
          <XStack gap="$2" justifyContent="center" flexWrap="wrap">
            {numbers.map((number, index) => (
              <LottoBall key={index} number={number} size="large" />
            ))}
            <XStack alignItems="center" gap="$2">
              <Text size="$6" color="muted">+</Text>
              <LottoBall number={latestDraw.bnusNo} size="large" isBonus />
            </XStack>
          </XStack>

          <YStack gap="$2" paddingTop="$4" borderTopWidth={1} borderTopColor="$borderColorWeak">
            <XStack justifyContent="space-between">
              <Text variant="label">1등 당첨금</Text>
              <Text weight="semibold">{formatPrize(latestDraw.firstWinamnt)}</Text>
            </XStack>
            <XStack justifyContent="space-between">
              <Text variant="label">1등 당첨자</Text>
              <Text weight="semibold">{latestDraw.firstPrzwnerCo}명</Text>
            </XStack>
            <XStack justifyContent="space-between">
              <Text variant="label">총 판매액</Text>
              <Text weight="semibold">{formatPrize(latestDraw.totSellamnt)}</Text>
            </XStack>
          </YStack>
        </YStack>
      </CardContent>
    </Card>
  );
}