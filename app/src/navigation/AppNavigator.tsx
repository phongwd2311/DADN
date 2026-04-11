import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../utils/theme';

// Auth screens
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Main (tab) screens
import HomeScreen from '../screens/main/HomeScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

// Calculator flow screens
import InputScreen from '../screens/calculator/InputScreen';
import ResultScreen from '../screens/calculator/ResultScreen';
import HistoryScreen from '../screens/calculator/HistoryScreen';
import DeviceSuggestionScreen from '../screens/calculator/DeviceSuggestionScreen';
import DeviceDetailScreen from '../screens/calculator/DeviceDetailScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const CalculateStack = createNativeStackNavigator();

// Calculate Stack: Input -> Result -> DeviceSuggestion
const CalculateStackNavigator = () => (
  <CalculateStack.Navigator screenOptions={{ headerShown: false }}>
    <CalculateStack.Screen name="Input" component={InputScreen} />
    <CalculateStack.Screen name="Result" component={ResultScreen} />
    <CalculateStack.Screen name="DeviceSuggestion" component={DeviceSuggestionScreen} />
    <CalculateStack.Screen name="DeviceDetail" component={DeviceDetailScreen} />
  </CalculateStack.Navigator>
);

// Bottom Tab Navigator
const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap = 'home';

        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Calculate') {
          iconName = focused ? 'calculator' : 'calculator-outline';
        } else if (route.name === 'History') {
          iconName = focused ? 'time' : 'time-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: Colors.primary,
      tabBarInactiveTintColor: Colors.textMuted,
      tabBarStyle: {
        backgroundColor: Colors.surface, // Now uses white from Light Theme
        borderTopColor: Colors.border,
        borderTopWidth: 1,
        height: 60,
        paddingBottom: 8,
        paddingTop: 8,
      },
      tabBarLabelStyle: {
        fontSize: 11,
        fontWeight: '600',
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Calculate" component={CalculateStackNavigator} />
    <Tab.Screen name="History" component={HistoryScreen} />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ tabBarLabel: 'Profile' }}
    />
  </Tab.Navigator>
);

import { View, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';

// Root Navigator: Auth -> Main
const AppNavigator = () => {
  const { user, isLoading } = React.useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        {user ? (
          <Stack.Screen name="Main" component={MainTabNavigator} />
        ) : (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

