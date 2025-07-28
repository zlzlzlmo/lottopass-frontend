'use client';

import { YStack, XStack, Card, CardContent, Heading, Text } from '@lottopass/ui';
import { useRouter } from 'next/navigation';

const features = [
  {
    title: '통계 분석',
    description: '과거 당첨 번호를 분석하여 패턴을 찾아드립니다',
    icon: '📊',
    href: '/statistics',
    color: '$info',
  },
  {
    title: '당첨 판매점',
    description: '가까운 1등 당첨 판매점을 찾아보세요',
    icon: '🏪',
    href: '/winning-stores',
    color: '$secondary',
  },
  {
    title: '번호 시뮬레이션',
    description: 'AI로 당첨 확률을 시뮬레이션해보세요',
    icon: '🎰',
    href: '/simulation',
    color: '$warning',
  },
  {
    title: '나의 번호',
    description: '저장한 번호의 당첨 여부를 확인하세요',
    icon: '💰',
    href: '/dashboard',
    color: '$primary',
  },
];

export function FeatureCards() {
  const router = useRouter();

  return (
    <YStack gap="$4">
      <Heading level={3} textAlign="center">
        더 많은 기능
      </Heading>
      
      <XStack flexWrap="wrap" gap="$4" justifyContent="center">
        {features.map((feature) => (
          <Card
            key={feature.title}
            interactive
            onPress={() => router.push(feature.href)}
            width={280}
            height={160}
          >
            <CardContent>
              <YStack gap="$3" alignItems="center" justifyContent="center" height="100%">
                <Text fontSize="$10">{feature.icon}</Text>
                <YStack gap="$1" alignItems="center">
                  <Heading level={5}>{feature.title}</Heading>
                  <Text variant="caption" color="muted" textAlign="center">
                    {feature.description}
                  </Text>
                </YStack>
              </YStack>
            </CardContent>
          </Card>
        ))}
      </XStack>
    </YStack>
  );
}