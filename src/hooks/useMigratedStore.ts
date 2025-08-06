import { useDrawStore, useLocationStore } from '@lottopass/stores';

/**
 * Redux에서 Zustand로 마이그레이션을 위한 헬퍼 훅
 * 기존 Redux 코드를 점진적으로 마이그레이션할 수 있도록 호환성 레이어 제공
 */

// Draw 관련 마이그레이션
export const useDraws = () => {
  const { allDraws, isLoading, error, fetchAllDraws } = useDrawStore();
  
  return {
    draws: allDraws,
    loading: isLoading,
    error,
    refetch: fetchAllDraws,
  };
};

export const useLatestDraw = () => {
  const { currentDraw, isLoading, error, fetchLatestDraw } = useDrawStore();
  
  return {
    draw: currentDraw,
    loading: isLoading,
    error,
    refetch: fetchLatestDraw,
  };
};

// Location 관련 마이그레이션
export const useLocation = () => {
  const {
    myLocation,
    myAddress,
    error,
    isLoading,
    setLocation,
    setAddress,
    clearLocation,
    requestLocation,
  } = useLocationStore();
  
  return {
    location: myLocation,
    address: myAddress,
    error,
    loading: isLoading,
    updateLocation: setLocation,
    updateAddress: setAddress,
    clear: clearLocation,
    requestCurrentLocation: requestLocation,
  };
};

// Redux 액션 호환성 헬퍼
export const useDrawActions = () => {
  const { fetchAllDraws, clearAllDraws } = useDrawStore();
  
  return {
    fetchAllDraws,
    clearAllDraws,
  };
};

export const useLocationActions = () => {
  const { setLocation, setAddress, setError, clearLocation } = useLocationStore();
  
  return {
    setLocation,
    setAddress,
    setError,
    clearLocation,
  };
};