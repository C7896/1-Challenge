import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "./screens/SplashScreen";
import Login0Screen from "./screens/Login0Screen";
import Login1Screen from "./screens/Login1Screen";
import SignupScreen from "./screens/SignupScreen";
import Intro1Screen from "./screens/Intro1Screen";
import Intro2Screen from "./screens/Intro2Screen";
import Intro3Screen from "./screens/Intro3Screen";
import {HomeTabs} from "./AppTab";
import Challenge1Screen from "./screens/Challenge1Screen";
import Challenge2Screen from "./screens/Challenge2Screen";
import Challenge3Screen from "./screens/Challenge3Screen";
import Challenge4Screen from "./screens/Challenge4Screen";


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{headerShown: false, animation: "fade"}} >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login0" component={Login0Screen} />
        <Stack.Screen name="Login1" component={Login1Screen} />
        <Stack.Screen name="Sign up" component={SignupScreen} />
        <Stack.Screen name="Intro1" component={Intro1Screen} />
        <Stack.Screen name="Intro2" component={Intro2Screen} />
        <Stack.Screen name="Intro3" component={Intro3Screen} />
        <Stack.Screen name="Home Tabs" component={HomeTabs} />
        <Stack.Screen name="Challenge1" component={Challenge1Screen} options={{
          headerShown: false,
        }} />
        <Stack.Screen name="Challenge2" component={Challenge2Screen} options={{
          headerShown: true,
          title: "",
          headerStyle: {
            backgroundColor: "#FF815E",
          },
          headerTintColor: "#FFF",
          headerShadowVisible: false,
        }} />
        <Stack.Screen name="Challenge3" component={Challenge3Screen} options={{
          headerShown: true,
          title: "",
          headerStyle: {
            backgroundColor: "#FFC0A2",
          },
          headerTintColor: "#FFF",
          headerShadowVisible: false,
        }} />
        <Stack.Screen name="Challenge4" component={Challenge4Screen} options={{
          headerShown: true,
          title: "",
          headerStyle: {
            backgroundColor: "#FF815E",
          },
          headerTintColor: "#FFF",
          headerShadowVisible: false,
        }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}