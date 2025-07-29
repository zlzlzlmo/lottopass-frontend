import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, View, Text, ActivityIndicator } from 'react-native';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LottoBall } from '../components/ui/LottoBall';
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
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
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
      className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="p-4 gap-4">
        {/* Hero Section */}
        <View className="bg-primary rounded-lg p-6">
          <View className="gap-3 items-center">
            <Text className="text-2xl font-bold text-white text-center">
              당신의 행운을 찾아드립니다
            </Text>
            <Text className="text-white opacity-90 text-center">
              AI 기반 번호 분석과 통계로 더 스마트한 로또 번호를 생성하세요
            </Text>
            {timeUntilDraw && (
              <View className="bg-white/20 px-4 py-2 rounded-lg">
                <Text className="text-white font-semibold">
                  다음 추첨까지 {timeUntilDraw}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Latest Draw */}
        {latestDraw && (
          <Card className="shadow-lg">
            <CardHeader>
              <View className="flex-row justify-between items-center">
                <CardTitle>제 {latestDraw.drwNo}회 당첨번호</CardTitle>
                <Text className="text-sm text-gray-500">
                  {formatDate(latestDraw.drwNoDate)}
                </Text>
              </View>
            </CardHeader>
            <CardContent>
              <View className="gap-4">
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row gap-2 py-2">
                    {numbers.map((number, index) => (
                      <LottoBall key={index} number={number} size="medium" />
                    ))}
                    <View className="flex-row items-center gap-2">
                      <Text className="text-xl text-gray-500">+</Text>
                      <LottoBall number={latestDraw.bnusNo} size="medium" isBonus />
                    </View>
                  </View>
                </ScrollView>

                <View className="gap-2 pt-2">
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">1등 당첨금</Text>
                    <Text className="font-semibold">{formatPrize(latestDraw.firstWinamnt)}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">1등 당첨자</Text>
                    <Text className="font-semibold">{latestDraw.firstPrzwnerCo}명</Text>
                  </View>
                </View>

                <Button
                  size="small"
                  variant="ghost"
                  onPress={() => navigation.navigate('DrawDetail', { drawNumber: latestDraw.drwNo })}
                >
                  상세보기
                </Button>
              </View>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <View className="gap-3">
          <Text className="text-lg font-semibold">빠른 메뉴</Text>
          <View className="flex-row flex-wrap gap-3">
            <Card
              onPress={() => navigation.navigate('Main', { screen: 'NumberGeneration' })}
              className="flex-1 min-w-[140px]"
            >
              <CardContent>
                <View className="gap-2 items-center py-3">
                  <Text className="text-3xl">🎲</Text>
                  <Text className="font-medium">번호 생성</Text>
                </View>
              </CardContent>
            </Card>

            <Card
              onPress={() => navigation.navigate('Main', { screen: 'Statistics' })}
              className="flex-1 min-w-[140px]"
            >
              <CardContent>
                <View className="gap-2 items-center py-3">
                  <Text className="text-3xl">📊</Text>
                  <Text className="font-medium">통계 분석</Text>
                </View>
              </CardContent>
            </Card>

            <Card
              onPress={() => navigation.navigate('Main', { screen: 'Stores' })}
              className="flex-1 min-w-[140px]"
            >
              <CardContent>
                <View className="gap-2 items-center py-3">
                  <Text className="text-3xl">🏪</Text>
                  <Text className="font-medium">판매점 찾기</Text>
                </View>
              </CardContent>
            </Card>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}