import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "./screens/SplashScreen";
import Login0Screen from "./screens/Login0Screen";
import Login1Screen from "./screens/Login1Screen";
import SignupStart from "./screens/SignupStart";
import SignupCredentials from "./screens/SignupCredentials";
import SignupProfile from "./screens/SignupProfile";
import Intro1Screen from "./screens/Intro1Screen";
import Intro2Screen from "./screens/Intro2Screen";
import Intro3Screen from "./screens/Intro3Screen";
import HomeScreen from "./screens/HomeScreen";
import LogScreen from "./screens/LogScreen";
import ProfileScreen from "./screens/ProfileScreen";
import LogDetailsScreen from "./screens/LogDetailsScreen";
import Challenge1Screen from "./screens/Challenge1Screen";
import Challenge2Screen from "./screens/Challenge2Screen";
import Challenge3Screen from "./screens/Challenge3Screen";
import Challenge4Screen from "./screens/Challenge4Screen";
import React, { useEffect } from 'react';
import { AppState, Platform, View } from 'react-native';
import { useNavigationContainerRef } from '@react-navigation/native';
import TabBar from './components/tabBar';
import * as Notifications from 'expo-notifications';

import { clearDeliveredNotifications, ensureDailyNotificationScheduled } from "./ScheduleNotification";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Stack = createNativeStackNavigator();

const INK = "#2B2724";

// The bar lives above the navigator so it stays put while pages slide beneath
// it. Rendering it inside each screen made it animate in and out with the page.
const TAB_BAR_ROUTES = new Set([
  "Home", "Log", "Profile",
  "Challenge1", "Challenge2", "Challenge3", "Challenge4",
]);
// screens whose background under the bar is light
const TAB_BAR_ON_LIGHT = new Set(["Home", "Log", "Profile", "Challenge3"]);
const tabTransition = (route) => ({
  animation: Platform.OS === "ios"
    ? "simple_push"
    : route.params?.tabAnimation ?? "ios_from_right",
  animationDuration: 320,
});

export default function App() {

  const navRef = useNavigationContainerRef();
  const [routeName, setRouteName] = React.useState(undefined);

  useEffect(() => {
    // Delivered reminders otherwise pile up in Notification Centre, one per day,
    // so clear them whenever the app comes to the front. Also re-arm the daily
    // reminder if permission is already granted but nothing is scheduled.
    const sync = () => {
      clearDeliveredNotifications();
      ensureDailyNotificationScheduled();
    };

    sync();
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        sync();
      }
    });

    return () => sub.remove();
  }, []);

  return (
    <NavigationContainer
      ref={navRef}
      onReady={() => setRouteName(navRef.getCurrentRoute()?.name)}
      onStateChange={() => setRouteName(navRef.getCurrentRoute()?.name)}
    >
      <View style={{ flex: 1 }}>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
          animation: "simple_push",
          animationDuration: 320,
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login0" component={Login0Screen} />
        <Stack.Screen name="Login1" component={Login1Screen} options={{ gestureEnabled: true }} />
        <Stack.Screen name="Sign up" component={SignupStart} options={{ gestureEnabled: true }} />
        <Stack.Screen name="SignupCredentials" component={SignupCredentials} options={{ gestureEnabled: true }} />
        <Stack.Screen name="SignupProfile" component={SignupProfile} options={{ gestureEnabled: true }} />
        <Stack.Screen name="Intro1" component={Intro1Screen} />
        <Stack.Screen name="Intro2" component={Intro2Screen} />
        <Stack.Screen name="Intro3" component={Intro3Screen} />
        <Stack.Screen name="Home" component={ HomeScreen } options={({ route }) => tabTransition(route)} />
        <Stack.Screen name="Log" component={ LogScreen } options={({ route }) => tabTransition(route)} />
        <Stack.Screen name="Profile" component={ ProfileScreen } options={({ route }) => tabTransition(route)} />
        <Stack.Screen name="Log Details" component={ LogDetailsScreen } options={{
          headerShown: true,
          title: "",
          headerBackButtonDisplayMode: "minimal",
          headerStyle: {
            backgroundColor: "#FFC0A2",
          },
          headerTintColor: INK,
          headerShadowVisible: false,
          gestureEnabled: true,
        }}/>
        <Stack.Screen name="Challenge1" component={Challenge1Screen} options={({ route }) => ({
          ...tabTransition(route),
          headerShown: false,
          gestureEnabled: true,
        })} />
        <Stack.Screen name="Challenge2" component={Challenge2Screen} options={{
          headerShown: true,
          title: "",
          headerBackButtonDisplayMode: "minimal",
          headerStyle: {
            backgroundColor: "#FF815E",
          },
          headerTintColor: "#FFF",
          headerShadowVisible: false,
          gestureEnabled: true,
        }} />
        <Stack.Screen name="Challenge3" component={Challenge3Screen} options={{
          headerShown: true,
          title: "",
          headerBackButtonDisplayMode: "minimal",
          headerStyle: {
            backgroundColor: "#FFC0A2",
          },
          headerTintColor: INK,
          headerShadowVisible: false,
          gestureEnabled: true,
        }} />
        <Stack.Screen name="Challenge4" component={Challenge4Screen} options={{
          headerShown: false,
        }} />
      </Stack.Navigator>
        {TAB_BAR_ROUTES.has(routeName) ? (
          <TabBar nav={navRef} activeRoute={routeName} onLight={TAB_BAR_ON_LIGHT.has(routeName)} />
        ) : null}
      </View>
    </NavigationContainer>
  );
}
