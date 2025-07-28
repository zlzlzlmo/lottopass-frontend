import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Location {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

interface LocationError {
  code: number;
  message: string;
}

// Query Keys
export const locationKeys = {
  all: ['location'] as const,
  current: () => [...locationKeys.all, 'current'] as const,
  permission: () => [...locationKeys.all, 'permission'] as const,
};

// 현재 위치 조회
export function useCurrentLocation(options?: PositionOptions) {
  return useQuery({
    queryKey: locationKeys.current(),
    queryFn: async (): Promise<Location> => {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation is not supported'));
          return;
        }
        
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              timestamp: position.timestamp,
            });
          },
          (error) => {
            reject({
              code: error.code,
              message: error.message,
            });
          },
          options || {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      });
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5분
  });
}

// 위치 권한 상태 조회
export function useLocationPermission() {
  return useQuery({
    queryKey: locationKeys.permission(),
    queryFn: async () => {
      if (!navigator.permissions) {
        return 'unsupported';
      }
      
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' });
        return result.state; // 'granted' | 'denied' | 'prompt'
      } catch {
        return 'unsupported';
      }
    },
  });
}

// 위치 업데이트 Mutation
export function useUpdateLocation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      return new Promise<Location>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              timestamp: position.timestamp,
            });
          },
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      });
    },
    onSuccess: (data) => {
      queryClient.setQueryData(locationKeys.current(), data);
    },
  });
}

// 위치 추적 Hook
export function useWatchLocation(
  onUpdate: (location: Location) => void,
  onError?: (error: LocationError) => void,
  options?: PositionOptions
) {
  const [watchId, setWatchId] = React.useState<number | null>(null);
  const queryClient = useQueryClient();
  
  React.useEffect(() => {
    if (!navigator.geolocation) {
      onError?.({
        code: 0,
        message: 'Geolocation is not supported',
      });
      return;
    }
    
    const id = navigator.geolocation.watchPosition(
      (position) => {
        const location: Location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        };
        
        // 캐시 업데이트
        queryClient.setQueryData(locationKeys.current(), location);
        onUpdate(location);
      },
      (error) => {
        onError?.({
          code: error.code,
          message: error.message,
        });
      },
      options || {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
    
    setWatchId(id);
    
    return () => {
      navigator.geolocation.clearWatch(id);
    };
  }, [onUpdate, onError, options, queryClient]);
  
  return {
    watchId,
    stopWatching: () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        setWatchId(null);
      }
    },
  };
}

// 거리 계산 유틸리티
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // 지구 반경 (km)
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}