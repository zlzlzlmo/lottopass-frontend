import React, { useState } from 'react';
import {
  YStack,
  XStack,
  ScrollView,
  Heading,
  Text,
  Card,
  CardContent,
  Button,
  Input,
  Spinner,
  Progress,
} from '@lottopass/ui';
import { LottoBall } from '@lottopass/ui';
import { useSimulateDraw } from '@lottopass/api-client';
import { formatNumber, formatPrize } from '@lottopass/shared';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/AppNavigator';

type RouteType = RouteProp<RootStackParamList, 'Simulation'>;

export default function SimulationScreen() {
  const route = useRoute<RouteType>();
  const { numbers } = route.params;
  const [iterations, setIterations] = useState('1000');
  const [simulationResult, setSimulationResult] = useState<any>(null);
  
  const { mutate: simulate, isPending } = useSimulateDraw();

  const handleSimulate = () => {
    const iterationCount = parseInt(iterations) || 1000;
    
    simulate(
      { numbers, iterations: iterationCount },
      {
        onSuccess: (data) => {
          setSimulationResult(data);
        },
        onError: () => {
          // Handle error
        },
      }
    );
  };

  const getRankLabel = (rank: number | null) => {
    if (!rank) return '낙첨';
    return `${rank}등`;
  };

  const getRankColor = (rank: number | null) => {
    switch (rank) {
      case 1: return '$danger';
      case 2: return '$warning';
      case 3: return '$info';
      case 4: return '$secondary';
      case 5: return '$primary';
      default: return '$color';
    }
  };

  return (
    <ScrollView flex={1} backgroundColor="$background">
      <YStack padding="$4" gap="$4">
        <Heading level={4}>시뮬레이션</Heading>

        {/* Selected Numbers */}
        <Card>
          <CardContent>
            <YStack gap="$3">
              <Text weight="semibold">선택한 번호</Text>
              <XStack gap="$2" flexWrap="wrap" justifyContent="center">
                {numbers.map((number, index) => (
                  <LottoBall key={index} number={number} size="medium" />
                ))}
              </XStack>
            </YStack>
          </CardContent>
        </Card>

        {/* Simulation Settings */}
        <Card>
          <CardContent>
            <YStack gap="$3">
              <Text weight="semibold">시뮬레이션 설정</Text>
              <YStack gap="$2">
                <Text variant="label">반복 횟수</Text>
                <XStack gap="$2" alignItems="center">
                  <Input
                    placeholder="1000"
                    value={iterations}
                    onChangeText={setIterations}
                    keyboardType="number-pad"
                    flex={1}
                  />
                  <Text variant="caption" color="muted">회</Text>
                </XStack>
                <Text variant="caption" color="muted">
                  * 최대 10,000회까지 가능합니다
                </Text>
              </YStack>
            </YStack>
          </CardContent>
        </Card>

        {/* Simulate Button */}
        <Button
          size="large"
          variant="primary"
          onPress={handleSimulate}
          disabled={isPending}
          fullWidth
        >
          {isPending ? '시뮬레이션 중...' : '시뮬레이션 시작'}
        </Button>

        {/* Loading State */}
        {isPending && (
          <YStack alignItems="center" gap="$3" paddingVertical="$4">
            <Spinner size="large" />
            <Text color="muted">시뮬레이션을 진행하고 있습니다...</Text>
          </YStack>
        )}

        {/* Results */}
        {simulationResult && !isPending && (
          <>
            {/* Summary */}
            <Card variant="elevated">
              <CardContent>
                <YStack gap="$3">
                  <Heading level={5}>시뮬레이션 결과</Heading>
                  
                  <YStack gap="$2">
                    <XStack justifyContent="space-between">
                      <Text variant="label">총 구매 금액</Text>
                      <Text weight="semibold">{formatPrize(simulationResult.totalCost)}</Text>
                    </XStack>
                    <XStack justifyContent="space-between">
                      <Text variant="label">총 당첨 금액</Text>
                      <Text weight="semibold" color="primary">
                        {formatPrize(Math.abs(simulationResult.netProfit) + simulationResult.totalCost)}
                      </Text>
                    </XStack>
                    <XStack justifyContent="space-between">
                      <Text variant="label">순수익</Text>
                      <Text 
                        weight="semibold" 
                        color={simulationResult.netProfit >= 0 ? 'secondary' : 'danger'}
                      >
                        {simulationResult.netProfit >= 0 ? '+' : ''}{formatPrize(simulationResult.netProfit)}
                      </Text>
                    </XStack>
                    <XStack justifyContent="space-between">
                      <Text variant="label">수익률</Text>
                      <Text 
                        weight="semibold" 
                        color={simulationResult.roi >= 0 ? 'secondary' : 'danger'}
                      >
                        {simulationResult.roi >= 0 ? '+' : ''}{simulationResult.roi.toFixed(2)}%
                      </Text>
                    </XStack>
                  </YStack>
                </YStack>
              </CardContent>
            </Card>

            {/* Detailed Results */}
            <Card>
              <CardContent>
                <YStack gap="$3">
                  <Text weight="semibold">등수별 당첨 현황</Text>
                  <YStack gap="$2">
                    {simulationResult.results.map((result: any) => (
                      <YStack key={result.rank || 'none'} gap="$2">
                        <XStack justifyContent="space-between" alignItems="center">
                          <Text color={getRankColor(result.rank)} weight="medium">
                            {getRankLabel(result.rank)}
                          </Text>
                          <Text>{formatNumber(result.count)}회</Text>
                        </XStack>
                        {result.count > 0 && (
                          <Progress 
                            value={(result.count / parseInt(iterations)) * 100} 
                            max={100}
                            backgroundColor="$backgroundPress"
                          >
                            <Progress.Indicator 
                              backgroundColor={getRankColor(result.rank)}
                              animation="bouncy"
                            />
                          </Progress>
                        )}
                      </YStack>
                    ))}
                  </YStack>
                </YStack>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card backgroundColor="$backgroundPress">
              <CardContent>
                <YStack gap="$2">
                  <Text weight="medium" color="warning">💡 참고사항</Text>
                  <Text variant="caption" color="muted">
                    이 시뮬레이션은 과거 당첨 데이터를 기반으로 한 확률적 계산입니다. 
                    실제 당첨 확률과는 차이가 있을 수 있으며, 투자의 참고 자료로만 활용하시기 바랍니다.
                  </Text>
                </YStack>
              </CardContent>
            </Card>
          </>
        )}
      </YStack>
    </ScrollView>
  );
}