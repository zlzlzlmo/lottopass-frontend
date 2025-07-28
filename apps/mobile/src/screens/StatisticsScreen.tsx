import React, { useState, useMemo } from 'react';
import { Dimensions } from 'react-native';
import {
  YStack,
  XStack,
  ScrollView,
  Heading,
  Text,
  Card,
  CardContent,
  Button,
  Spinner,
} from '@lottopass/ui';
import { LottoBall } from '@lottopass/ui';
import { useStatistics, useAllDraws } from '@lottopass/api-client';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { getNumberColor } from '@lottopass/shared';

const screenWidth = Dimensions.get('window').width;

export default function StatisticsScreen() {
  const [drawRange, setDrawRange] = useState({ start: 1, end: 100 });
  const { data: statistics, isLoading } = useStatistics({
    startDraw: drawRange.start,
    endDraw: drawRange.end,
  });
  const { data: allDraws } = useAllDraws({ pageSize: 10 });

  const chartData = useMemo(() => {
    if (!statistics) return null;

    const sortedNumbers = Object.entries(statistics.numberFrequencies)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);

    return {
      labels: sortedNumbers.map(([num]) => num),
      datasets: [
        {
          data: sortedNumbers.map(([, freq]) => freq),
        },
      ],
    };
  }, [statistics]);

  const hotNumbers = useMemo(() => {
    if (!statistics) return [];
    
    return Object.entries(statistics.numberFrequencies)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6)
      .map(([num]) => parseInt(num));
  }, [statistics]);

  const coldNumbers = useMemo(() => {
    if (!statistics) return [];
    
    return Object.entries(statistics.numberFrequencies)
      .sort(([, a], [, b]) => a - b)
      .slice(0, 6)
      .map(([num]) => parseInt(num));
  }, [statistics]);

  if (isLoading) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center">
        <Spinner size="large" />
      </YStack>
    );
  }

  return (
    <ScrollView flex={1} backgroundColor="$background">
      <YStack padding="$4" gap="$4">
        <Heading level={4}>번호 통계 분석</Heading>

        {/* Draw Range Selection */}
        <Card>
          <CardContent>
            <YStack gap="$3">
              <Text weight="semibold">분석 범위</Text>
              <XStack gap="$3" alignItems="center">
                <Text>최근</Text>
                <XStack gap="$2">
                  <Button
                    size="small"
                    variant={drawRange.end === 10 ? 'primary' : 'ghost'}
                    onPress={() => setDrawRange({ start: 1, end: 10 })}
                  >
                    10회
                  </Button>
                  <Button
                    size="small"
                    variant={drawRange.end === 50 ? 'primary' : 'ghost'}
                    onPress={() => setDrawRange({ start: 1, end: 50 })}
                  >
                    50회
                  </Button>
                  <Button
                    size="small"
                    variant={drawRange.end === 100 ? 'primary' : 'ghost'}
                    onPress={() => setDrawRange({ start: 1, end: 100 })}
                  >
                    100회
                  </Button>
                </XStack>
              </XStack>
            </YStack>
          </CardContent>
        </Card>

        {/* Hot Numbers */}
        <Card>
          <CardContent>
            <YStack gap="$3">
              <Text weight="semibold" color="$danger">
                🔥 핫 넘버 (자주 나온 번호)
              </Text>
              <XStack gap="$2" flexWrap="wrap">
                {hotNumbers.map((number) => (
                  <LottoBall key={number} number={number} size="medium" />
                ))}
              </XStack>
            </YStack>
          </CardContent>
        </Card>

        {/* Cold Numbers */}
        <Card>
          <CardContent>
            <YStack gap="$3">
              <Text weight="semibold" color="$info">
                ❄️ 콜드 넘버 (적게 나온 번호)
              </Text>
              <XStack gap="$2" flexWrap="wrap">
                {coldNumbers.map((number) => (
                  <LottoBall key={number} number={number} size="medium" />
                ))}
              </XStack>
            </YStack>
          </CardContent>
        </Card>

        {/* Frequency Chart */}
        {chartData && (
          <Card>
            <CardContent>
              <YStack gap="$3">
                <Text weight="semibold">번호별 출현 빈도 TOP 10</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <BarChart
                    data={chartData}
                    width={Math.max(screenWidth - 32, chartData.labels.length * 40)}
                    height={220}
                    yAxisLabel=""
                    yAxisSuffix="회"
                    chartConfig={{
                      backgroundColor: '#ffffff',
                      backgroundGradientFrom: '#ffffff',
                      backgroundGradientTo: '#ffffff',
                      decimalPlaces: 0,
                      color: (opacity = 1) => `rgba(22, 119, 255, ${opacity})`,
                      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                      style: {
                        borderRadius: 16,
                      },
                      propsForDots: {
                        r: '6',
                        strokeWidth: '2',
                        stroke: '#1677ff',
                      },
                    }}
                    style={{
                      marginVertical: 8,
                      borderRadius: 16,
                    }}
                  />
                </ScrollView>
              </YStack>
            </CardContent>
          </Card>
        )}

        {/* Statistics Summary */}
        {statistics && (
          <Card>
            <CardContent>
              <YStack gap="$3">
                <Text weight="semibold">통계 요약</Text>
                <YStack gap="$2">
                  <XStack justifyContent="space-between">
                    <Text variant="label">분석 회차 수</Text>
                    <Text weight="semibold">{statistics.totalDraws}회</Text>
                  </XStack>
                  <XStack justifyContent="space-between">
                    <Text variant="label">홀수/짝수 평균</Text>
                    <Text weight="semibold">
                      {statistics.oddEvenRatio.odd.toFixed(1)} : {statistics.oddEvenRatio.even.toFixed(1)}
                    </Text>
                  </XStack>
                  <XStack justifyContent="space-between">
                    <Text variant="label">고/저 평균</Text>
                    <Text weight="semibold">
                      {statistics.highLowRatio.high.toFixed(1)} : {statistics.highLowRatio.low.toFixed(1)}
                    </Text>
                  </XStack>
                  <XStack justifyContent="space-between">
                    <Text variant="label">번호 합 평균</Text>
                    <Text weight="semibold">{statistics.sumRanges.average.toFixed(0)}</Text>
                  </XStack>
                </YStack>
              </YStack>
            </CardContent>
          </Card>
        )}
      </YStack>
    </ScrollView>
  );
}