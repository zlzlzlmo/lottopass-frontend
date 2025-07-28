import React, { useState } from 'react';
import {
  YStack,
  XStack,
  ScrollView,
  Heading,
  Text,
  Button,
  Card,
  CardContent,
  RadioGroup,
  Label,
  Separator,
} from '@lottopass/ui';
import { LottoBall, LottoNumberGrid } from '@lottopass/ui';
import { useGenerateNumbers } from '@lottopass/api-client';
import { useLottoStore, useUIStore } from '@lottopass/stores';
import { generateId, type GenerationMethod } from '@lottopass/shared';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const generationMethods: Array<{ value: GenerationMethod; label: string; description: string }> = [
  { value: 'random', label: '완전 랜덤', description: '순수하게 무작위로 번호를 생성합니다' },
  { value: 'statistical', label: '통계 기반', description: '자주 나온 번호를 우선적으로 선택합니다' },
  { value: 'pattern', label: '패턴 분석', description: '최근 당첨 패턴을 분석하여 생성합니다' },
  { value: 'ai', label: 'AI 추천', description: 'AI가 분석한 최적의 번호를 추천합니다' },
  { value: 'evenOdd', label: '홀짝 균형', description: '홀수와 짝수를 균형있게 선택합니다' },
  { value: 'highLow', label: '고저 균형', description: '높은 번호와 낮은 번호를 균형있게 선택합니다' },
];

export default function NumberGenerationScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [selectedMethod, setSelectedMethod] = useState<GenerationMethod>('random');
  const [includeNumbers, setIncludeNumbers] = useState<number[]>([]);
  const [excludeNumbers, setExcludeNumbers] = useState<number[]>([]);
  const [generatedNumbers, setGeneratedNumbers] = useState<number[]>([]);
  const [showIncludeGrid, setShowIncludeGrid] = useState(false);
  const [showExcludeGrid, setShowExcludeGrid] = useState(false);
  
  const { mutate: generate, isPending } = useGenerateNumbers();
  const { addGeneratedNumbers } = useLottoStore();
  const { showToast } = useUIStore();

  const handleGenerate = () => {
    generate(
      {
        method: selectedMethod,
        options: {
          includeNumbers: includeNumbers.length > 0 ? includeNumbers : undefined,
          excludeNumbers: excludeNumbers.length > 0 ? excludeNumbers : undefined,
        },
      },
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

  const toggleIncludeNumber = (number: number) => {
    setIncludeNumbers((prev) =>
      prev.includes(number) ? prev.filter((n) => n !== number) : [...prev, number]
    );
  };

  const toggleExcludeNumber = (number: number) => {
    setExcludeNumbers((prev) =>
      prev.includes(number) ? prev.filter((n) => n !== number) : [...prev, number]
    );
  };

  return (
    <ScrollView flex={1} backgroundColor="$background">
      <YStack padding="$4" gap="$4">
        <Heading level={4}>번호 생성</Heading>

        {/* Generation Method Selection */}
        <Card>
          <CardContent>
            <YStack gap="$3">
              <Text weight="semibold">생성 방식 선택</Text>
              <RadioGroup
                value={selectedMethod}
                onValueChange={(value) => setSelectedMethod(value as GenerationMethod)}
              >
                <YStack gap="$2">
                  {generationMethods.map((method) => (
                    <XStack key={method.value} gap="$3" alignItems="center">
                      <RadioGroup.Item value={method.value} id={method.value}>
                        <RadioGroup.Indicator />
                      </RadioGroup.Item>
                      <Label htmlFor={method.value} flex={1}>
                        <YStack gap="$1">
                          <Text weight="medium">{method.label}</Text>
                          <Text variant="caption" color="muted">
                            {method.description}
                          </Text>
                        </YStack>
                      </Label>
                    </XStack>
                  ))}
                </YStack>
              </RadioGroup>
            </YStack>
          </CardContent>
        </Card>

        {/* Include Numbers */}
        <Card>
          <CardContent>
            <YStack gap="$3">
              <XStack justifyContent="space-between" alignItems="center">
                <Text weight="semibold">포함할 번호</Text>
                <Button
                  size="small"
                  variant="ghost"
                  onPress={() => setShowIncludeGrid(!showIncludeGrid)}
                >
                  {showIncludeGrid ? '닫기' : '선택'}
                </Button>
              </XStack>
              
              {includeNumbers.length > 0 && (
                <XStack gap="$2" flexWrap="wrap">
                  {includeNumbers.sort((a, b) => a - b).map((number) => (
                    <LottoBall
                      key={number}
                      number={number}
                      size="small"
                      onPress={() => toggleIncludeNumber(number)}
                    />
                  ))}
                </XStack>
              )}
              
              {showIncludeGrid && (
                <>
                  <Separator />
                  <LottoNumberGrid
                    selectedNumbers={includeNumbers}
                    excludedNumbers={excludeNumbers}
                    onNumberPress={toggleIncludeNumber}
                  />
                </>
              )}
            </YStack>
          </CardContent>
        </Card>

        {/* Exclude Numbers */}
        <Card>
          <CardContent>
            <YStack gap="$3">
              <XStack justifyContent="space-between" alignItems="center">
                <Text weight="semibold">제외할 번호</Text>
                <Button
                  size="small"
                  variant="ghost"
                  onPress={() => setShowExcludeGrid(!showExcludeGrid)}
                >
                  {showExcludeGrid ? '닫기' : '선택'}
                </Button>
              </XStack>
              
              {excludeNumbers.length > 0 && (
                <XStack gap="$2" flexWrap="wrap">
                  {excludeNumbers.sort((a, b) => a - b).map((number) => (
                    <LottoBall
                      key={number}
                      number={number}
                      size="small"
                      onPress={() => toggleExcludeNumber(number)}
                    />
                  ))}
                </XStack>
              )}
              
              {showExcludeGrid && (
                <>
                  <Separator />
                  <LottoNumberGrid
                    selectedNumbers={excludeNumbers}
                    excludedNumbers={includeNumbers}
                    onNumberPress={toggleExcludeNumber}
                  />
                </>
              )}
            </YStack>
          </CardContent>
        </Card>

        {/* Generated Numbers */}
        {generatedNumbers.length > 0 && (
          <Card variant="elevated" backgroundColor="$backgroundPress">
            <CardContent>
              <YStack gap="$3" alignItems="center">
                <Text weight="semibold">생성된 번호</Text>
                <XStack gap="$2" flexWrap="wrap" justifyContent="center">
                  {generatedNumbers.map((number, index) => (
                    <LottoBall key={index} number={number} size="large" />
                  ))}
                </XStack>
                <Button
                  size="small"
                  variant="secondary"
                  onPress={() => navigation.navigate('Simulation', { numbers: generatedNumbers })}
                >
                  시뮬레이션 실행
                </Button>
              </YStack>
            </CardContent>
          </Card>
        )}

        {/* Generate Button */}
        <Button
          size="large"
          variant="primary"
          onPress={handleGenerate}
          disabled={isPending || (includeNumbers.length > 6)}
          fullWidth
        >
          {isPending ? '생성 중...' : '번호 생성하기'}
        </Button>
      </YStack>
    </ScrollView>
  );
}