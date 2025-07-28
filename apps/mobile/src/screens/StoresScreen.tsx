import React, { useState, useEffect } from 'react';
import { Alert, Linking, Platform } from 'react-native';
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
} from '@lottopass/ui';
import { useWinningStores, useNearbyStores } from '@lottopass/api-client';
import * as Location from 'expo-location';
import { formatNumber } from '@lottopass/shared';

export default function StoresScreen() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedRegion, setSelectedRegion] = useState({ sido: '', sigungu: '' });
  const [searchKeyword, setSearchKeyword] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);

  const { data: winningStores, isLoading: winningLoading } = useWinningStores({
    sido: selectedRegion.sido || undefined,
    sigungu: selectedRegion.sigungu || undefined,
    limit: 20,
  });

  const { data: nearbyStores, isLoading: nearbyLoading } = useNearbyStores({
    latitude: location?.latitude || 0,
    longitude: location?.longitude || 0,
    radius: 5000,
    onlyWinners: true,
  });

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          '위치 권한 필요',
          '주변 판매점을 찾기 위해 위치 권한이 필요합니다.',
          [{ text: '확인' }]
        );
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
    } catch (error) {
      Alert.alert('오류', '위치를 가져올 수 없습니다.');
    } finally {
      setLocationLoading(false);
    }
  };

  const openMap = (store: any) => {
    const scheme = Platform.select({
      ios: 'maps:0,0?q=',
      android: 'geo:0,0?q=',
    });
    const latLng = `${store.latitude},${store.longitude}`;
    const label = encodeURIComponent(store.name);
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    if (url) {
      Linking.openURL(url);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  const stores = location && nearbyStores ? nearbyStores : winningStores || [];
  const isLoading = locationLoading || nearbyLoading || winningLoading;

  return (
    <ScrollView flex={1} backgroundColor="$background">
      <YStack padding="$4" gap="$4">
        <Heading level={4}>로또 판매점 찾기</Heading>

        {/* Location Permission */}
        <Card>
          <CardContent>
            <YStack gap="$3">
              <XStack justifyContent="space-between" alignItems="center">
                <YStack flex={1}>
                  <Text weight="semibold">내 주변 판매점</Text>
                  <Text variant="caption" color="muted">
                    {location ? '위치 정보 사용 중' : '위치 권한이 필요합니다'}
                  </Text>
                </YStack>
                <Button
                  size="small"
                  variant="secondary"
                  onPress={requestLocationPermission}
                  disabled={locationLoading}
                >
                  {locationLoading ? '위치 확인 중...' : '위치 새로고침'}
                </Button>
              </XStack>
            </YStack>
          </CardContent>
        </Card>

        {/* Search */}
        <Card>
          <CardContent>
            <YStack gap="$3">
              <Text weight="semibold">검색</Text>
              <Input
                placeholder="판매점 이름 또는 주소 검색"
                value={searchKeyword}
                onChangeText={setSearchKeyword}
                fullWidth
              />
            </YStack>
          </CardContent>
        </Card>

        {/* Store List */}
        {isLoading ? (
          <YStack alignItems="center" justifyContent="center" paddingVertical="$8">
            <Spinner size="large" />
          </YStack>
        ) : (
          <YStack gap="$3">
            <Text weight="semibold">
              {location ? '주변 당첨 판매점' : '전체 당첨 판매점'} ({stores.length}개)
            </Text>
            
            {stores
              .filter((store) =>
                searchKeyword
                  ? store.name.includes(searchKeyword) || store.address.includes(searchKeyword)
                  : true
              )
              .map((store, index) => (
                <Card key={`${store.id}-${index}`} interactive onPress={() => openMap(store)}>
                  <CardContent>
                    <YStack gap="$2">
                      <XStack justifyContent="space-between" alignItems="flex-start">
                        <YStack flex={1} gap="$1">
                          <Text weight="semibold">{store.name}</Text>
                          <Text variant="caption" color="muted">
                            {store.address}
                          </Text>
                        </YStack>
                        {location && store.latitude && store.longitude && (
                          <Text variant="caption" color="primary">
                            {calculateDistance(
                              location.latitude,
                              location.longitude,
                              store.latitude,
                              store.longitude
                            ).toFixed(1)}km
                          </Text>
                        )}
                      </XStack>
                      
                      {store.winningHistory && store.winningHistory.length > 0 && (
                        <YStack gap="$1" paddingTop="$2">
                          <Text variant="caption" weight="medium">
                            당첨 이력
                          </Text>
                          {store.winningHistory.slice(0, 3).map((history, idx) => (
                            <Text key={idx} variant="caption" color="muted">
                              {history.drawNumber}회 {history.rank}등 - {formatNumber(history.amount)}원
                            </Text>
                          ))}
                        </YStack>
                      )}
                    </YStack>
                  </CardContent>
                </Card>
              ))}
          </YStack>
        )}
      </YStack>
    </ScrollView>
  );
}