import 'react-native-gesture-handler';
import './src/styles/global.css';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ApiProvider } from '@lottopass/api-client';
import { AppNavigator } from './src/navigation/AppNavigator';
import { NotificationProvider } from './src/providers/NotificationProvider';
import { LocationProvider } from './src/providers/LocationProvider';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ApiProvider enableDevtools={__DEV__}>
      <SafeAreaProvider>
        <NotificationProvider>
          <LocationProvider>
            <StatusBar style="auto" />
            <AppNavigator />
          </LocationProvider>
        </NotificationProvider>
      </SafeAreaProvider>
    </ApiProvider>
  );
}