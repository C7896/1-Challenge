import { NavigationContainer, StackActions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "./screens/SplashScreen";
import Intro1Screen from "./screens/Intro1Screen";
import Intro2Screen from "./screens/Intro2Screen";
import Intro3Screen from "./screens/Intro3Screen";
import {HomeTabs} from "./AppTab";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{headerShown: false, animation: "fade"}} >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Intro1" component={Intro1Screen} />
        <Stack.Screen name="Intro2" component={Intro2Screen} />
        <Stack.Screen name="Intro3" component={Intro3Screen} />
        <Stack.Screen name="Home Tabs" component={HomeTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}