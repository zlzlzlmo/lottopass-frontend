import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { useAuthStore } from '@lottopass/stores';

// Screens
import HomeScreen from '../screens/HomeScreen';
import NumberGenerationScreen from '../screens/NumberGenerationScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import StoresScreen from '../screens/StoresScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import DrawDetailScreen from '../screens/DrawDetailScreen';
import SimulationScreen from '../screens/SimulationScreen';

// Icons (using text for now, replace with actual icons)

export type RootStackParamList = {
  Main: undefined;
  Login: undefined;
  Signup: undefined;
  DrawDetail: { drawNumber: number };
  Simulation: { numbers: number[] };
};

export type MainTabParamList = {
  Home: undefined;
  NumberGeneration: undefined;
  Statistics: undefined;
  Stores: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E7EB',
          borderTopWidth: 1,
          paddingBottom: 4,
          paddingTop: 4,
          height: 56,
        },
        headerStyle: {
          backgroundColor: '#3B82F6',
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: '홈',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 24 }}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="NumberGeneration"
        component={NumberGenerationScreen}
        options={{
          title: '번호 생성',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 24 }}>🎲</Text>,
        }}
      />
      <Tab.Screen
        name="Statistics"
        component={StatisticsScreen}
        options={{
          title: '통계',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 24 }}>📊</Text>,
        }}
      />
      <Tab.Screen
        name="Stores"
        component={StoresScreen}
        options={{
          title: '판매점',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 24 }}>🏪</Text>,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: '내 정보',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 24 }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const { isAuthenticated } = useAuthStore();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#3B82F6',
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: '로그인' }}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{ title: '회원가입' }}
        />
        <Stack.Screen
          name="DrawDetail"
          component={DrawDetailScreen}
          options={{ title: '회차 상세' }}
        />
        <Stack.Screen
          name="Simulation"
          component={SimulationScreen}
          options={{ title: '시뮬레이션' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}