import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { useUIStore } from '@lottopass/stores';

interface LocationContextType {
  location: Location.LocationObject | null;
  address: string | null;
  errorMsg: string | null;
  isLoading: boolean;
  refreshLocation: () => Promise<void>;
  requestPermission: () => Promise<boolean>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useUIStore();

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    const { status } = await Location.getForegroundPermissionsAsync();
    if (status === 'granted') {
      await getCurrentLocation();
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
    
    if (existingStatus === 'granted') {
      return true;
    }

    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      setErrorMsg('위치 권한이 거부되었습니다.');
      showToast({
        type: 'error',
        message: '위치 서비스를 사용하려면 권한이 필요합니다.',
      });
      return false;
    }
    
    return true;
  };

  const getCurrentLocation = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      setLocation(currentLocation);

      // Get address from coordinates
      const [reverseGeocode] = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (reverseGeocode) {
        const addressParts = [
          reverseGeocode.city,
          reverseGeocode.district,
          reverseGeocode.street,
          reverseGeocode.name,
        ].filter(Boolean);
        
        setAddress(addressParts.join(' '));
      }
    } catch (error) {
      setErrorMsg('위치를 가져올 수 없습니다.');
      console.error('Location error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshLocation = async () => {
    const hasPermission = await requestPermission();
    if (hasPermission) {
      await getCurrentLocation();
    }
  };

  const value = {
    location,
    address,
    errorMsg,
    isLoading,
    refreshLocation,
    requestPermission,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within LocationProvider');
  }
  return context;
}