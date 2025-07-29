import React, { useState } from 'react';
import { ScrollView, View, Text, ActivityIndicator } from 'react-native';
import { 
  Button, 
  Card, 
  CardContent, 
  RadioGroup, 
  Label,
  Separator,
  LottoBall,
  LottoNumberGrid
} from '../components/ui';
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
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4 gap-4">
        <Text className="text-2xl font-bold">번호 생성</Text>

        {/* Generation Method Selection */}
        <Card>
          <CardContent>
            <View className="gap-3">
              <Text className="font-semibold">생성 방식 선택</Text>
              <RadioGroup
                value={selectedMethod}
                onValueChange={(value) => setSelectedMethod(value as GenerationMethod)}
              >
                <View className="gap-2">
                  {generationMethods.map((method) => (
                    <View key={method.value} className="flex-row gap-3 items-start">
                      <RadioGroup.Item value={method.value} id={method.value}>
                        <RadioGroup.Indicator />
                      </RadioGroup.Item>
                      <View className="flex-1">
                        <Text className="font-medium">{method.label}</Text>
                        <Text className="text-sm text-gray-500">
                          {method.description}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </RadioGroup>
            </View>
          </CardContent>
        </Card>

        {/* Include Numbers */}
        <Card>
          <CardContent>
            <View className="gap-3">
              <View className="flex-row justify-between items-center">
                <Text className="font-semibold">포함할 번호</Text>
                <Button
                  size="small"
                  variant="ghost"
                  onPress={() => setShowIncludeGrid(!showIncludeGrid)}
                >
                  {showIncludeGrid ? '닫기' : '선택'}
                </Button>
              </View>
              
              {includeNumbers.length > 0 && (
                <View className="flex-row gap-2 flex-wrap">
                  {includeNumbers.sort((a, b) => a - b).map((number) => (
                    <LottoBall
                      key={number}
                      number={number}
                      size="small"
                    />
                  ))}
                </View>
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
            </View>
          </CardContent>
        </Card>

        {/* Exclude Numbers */}
        <Card>
          <CardContent>
            <View className="gap-3">
              <View className="flex-row justify-between items-center">
                <Text className="font-semibold">제외할 번호</Text>
                <Button
                  size="small"
                  variant="ghost"
                  onPress={() => setShowExcludeGrid(!showExcludeGrid)}
                >
                  {showExcludeGrid ? '닫기' : '선택'}
                </Button>
              </View>
              
              {excludeNumbers.length > 0 && (
                <View className="flex-row gap-2 flex-wrap">
                  {excludeNumbers.sort((a, b) => a - b).map((number) => (
                    <LottoBall
                      key={number}
                      number={number}
                      size="small"
                    />
                  ))}
                </View>
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
            </View>
          </CardContent>
        </Card>

        {/* Generated Numbers */}
        {generatedNumbers.length > 0 && (
          <Card className="bg-primary/5">
            <CardContent>
              <View className="gap-3 items-center">
                <Text className="font-semibold">생성된 번호</Text>
                <View className="flex-row gap-2 flex-wrap justify-center">
                  {generatedNumbers.map((number, index) => (
                    <LottoBall key={index} number={number} size="large" />
                  ))}
                </View>
                <Button
                  size="small"
                  variant="secondary"
                  onPress={() => navigation.navigate('Simulation', { numbers: generatedNumbers })}
                >
                  시뮬레이션 실행
                </Button>
              </View>
            </CardContent>
          </Card>
        )}

        {/* Generate Button */}
        <Button
          size="large"
          variant="primary"
          onPress={handleGenerate}
          disabled={isPending || (includeNumbers.length > 6)}
          className="w-full"
        >
          {isPending ? '생성 중...' : '번호 생성하기'}
        </Button>
      </View>
    </ScrollView>
  );
}