import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface Location {
  latitude: number;
  longitude: number;
}

interface LocationState {
  myLocation: Location | null;
  myAddress: string | null;
  error: string | null;
  isLoading: boolean;
  
  // Actions
  setLocation: (location: Location) => void;
  setAddress: (address: string) => void;
  setError: (error: string | null) => void;
  clearLocation: () => void;
  requestLocation: () => Promise<void>;
}

export const useLocationStore = create<LocationState>()(
  devtools(
    persist(
      (set, get) => ({
        myLocation: null,
        myAddress: null,
        error: null,
        isLoading: false,

        setLocation: (location: Location) => {
          set({ myLocation: location, error: null });
        },

        setAddress: (address: string) => {
          set({ myAddress: address });
        },

        setError: (error: string | null) => {
          set({ error });
        },

        clearLocation: () => {
          set({ 
            myLocation: null, 
            myAddress: null, 
            error: null 
          });
        },

        requestLocation: async () => {
          set({ isLoading: true, error: null });
          
          if (!navigator.geolocation) {
            set({ 
              error: '브라우저가 위치 서비스를 지원하지 않습니다.', 
              isLoading: false 
            });
            return;
          }

          try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
              });
            });

            const location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };

            set({ 
              myLocation: location, 
              isLoading: false,
              error: null 
            });

            // 역지오코딩으로 주소 가져오기
            try {
              const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.latitude},${location.longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&language=ko`
              );
              const data = await response.json();
              
              if (data.results && data.results[0]) {
                set({ myAddress: data.results[0].formatted_address });
              }
            } catch (error) {
              console.error('주소 변환 실패:', error);
            }
          } catch (error) {
            let errorMessage = '위치 정보를 가져올 수 없습니다.';
            
            if (error instanceof GeolocationPositionError) {
              switch (error.code) {
                case error.PERMISSION_DENIED:
                  errorMessage = '위치 권한이 거부되었습니다.';
                  break;
                case error.POSITION_UNAVAILABLE:
                  errorMessage = '위치 정보를 사용할 수 없습니다.';
                  break;
                case error.TIMEOUT:
                  errorMessage = '위치 요청 시간이 초과되었습니다.';
                  break;
              }
            }
            
            set({ 
              error: errorMessage, 
              isLoading: false 
            });
          }
        },
      }),
      {
        name: 'location-storage',
        partialize: (state) => ({ 
          myLocation: state.myLocation, 
          myAddress: state.myAddress 
        }),
      }
    ),
    {
      name: 'LocationStore',
    }
  )
);