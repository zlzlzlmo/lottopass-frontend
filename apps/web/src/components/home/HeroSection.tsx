'use client';

import { YStack, XStack, Heading, Text, Button } from '@lottopass/ui';
import { useRouter } from 'next/navigation';
import { formatTimeUntilDraw } from '@lottopass/shared';
import { useEffect, useState } from 'react';

export function HeroSection() {
  const router = useRouter();
  const [timeUntilDraw, setTimeUntilDraw] = useState('');

  useEffect(() => {
    const updateTime = () => {
      setTimeUntilDraw(formatTimeUntilDraw());
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <YStack
      backgroundColor="$primary"
      paddingVertical="$10"
      paddingHorizontal="$4"
      alignItems="center"
      justifyContent="center"
      minHeight={400}
    >
      <YStack gap="$4" alignItems="center" maxWidth={800}>
        <Heading level={1} color="white" textAlign="center">
          당신의 행운을 찾아드립니다
        </Heading>
        
        <Text color="white" variant="body" textAlign="center" opacity={0.9}>
          AI 기반 번호 분석과 통계로 더 스마트한 로또 번호를 생성하세요
        </Text>

        {timeUntilDraw && (
          <YStack
            backgroundColor="rgba(255,255,255,0.2)"
            paddingHorizontal="$4"
            paddingVertical="$3"
            borderRadius="$4"
            marginTop="$2"
          >
            <Text color="white" weight="semibold">
              다음 추첨까지 {timeUntilDraw}
            </Text>
          </YStack>
        )}

        <XStack gap="$3" marginTop="$4">
          <Button
            size="large"
            variant="secondary"
            onPress={() => router.push('/number-generation')}
          >
            번호 생성하기
          </Button>
          
          <Button
            size="large"
            variant="ghost"
            onPress={() => router.push('/statistics')}
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            통계 보기
          </Button>
        </XStack>
      </YStack>
    </YStack>
  );
}