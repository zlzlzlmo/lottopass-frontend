'use client';

import { YStack, XStack, Card, CardHeader, CardContent, Heading, Text, Button } from '@lottopass/ui';
import { LottoBall } from '@lottopass/ui';
import { useGenerateNumbers } from '@lottopass/api-client';
import { useLottoStore, useUIStore } from '@lottopass/stores';
import { generateId } from '@lottopass/shared';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function QuickNumberGeneration() {
  const router = useRouter();
  const [generatedNumbers, setGeneratedNumbers] = useState<number[]>([]);
  const { mutate: generate, isPending } = useGenerateNumbers();
  const { addGeneratedNumbers } = useLottoStore();
  const { showToast } = useUIStore();

  const handleQuickGenerate = () => {
    generate(
      { method: 'random' },
      {
        onSuccess: (data) => {
          setGeneratedNumbers(data.numbers);
          addGeneratedNumbers({
            ...data,
            id: generateId(),
            createdAt: new Date().toISOString(),
          });
          showToast({
            type: 'success',
            message: '번호가 생성되었습니다!',
          });
        },
        onError: () => {
          showToast({
            type: 'error',
            message: '번호 생성에 실패했습니다.',
          });
        },
      }
    );
  };

  return (
    <Card variant="elevated">
      <CardHeader>
        <Heading level={4}>빠른 번호 생성</Heading>
      </CardHeader>
      
      <CardContent>
        <YStack gap="$4" alignItems="center">
          {generatedNumbers.length > 0 ? (
            <>
              <XStack gap="$2" justifyContent="center" flexWrap="wrap">
                {generatedNumbers.map((number, index) => (
                  <LottoBall key={index} number={number} size="large" />
                ))}
              </XStack>
              
              <Text variant="caption" color="muted" textAlign="center">
                AI가 분석한 이번 주 추천 번호입니다
              </Text>
            </>
          ) : (
            <YStack alignItems="center" gap="$3" paddingVertical="$4">
              <Text color="muted" textAlign="center">
                버튼을 눌러 행운의 번호를 받아보세요
              </Text>
            </YStack>
          )}

          <XStack gap="$3">
            <Button
              variant="primary"
              onPress={handleQuickGenerate}
              disabled={isPending}
            >
              {isPending ? '생성 중...' : '번호 생성'}
            </Button>
            
            {generatedNumbers.length > 0 && (
              <Button
                variant="secondary"
                onPress={() => router.push('/number-generation')}
              >
                더 많은 옵션
              </Button>
            )}
          </XStack>
        </YStack>
      </CardContent>
    </Card>
  );
}