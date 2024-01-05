import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./screens/HomeScreen";
import LogScreen from "./screens/LogScreen";

const Tab = createBottomTabNavigator();

export const HomeTabs = () => {
    return (
        <Tab.Navigator initialRouteName="Home">
            <Tab.Screen name="Home" component={ HomeScreen } options={{headerShown: false,}} />
            <Tab.Screen name="Log" component={ LogScreen } options={{headerShown: false,}} />
        </Tab.Navigator>
    );
};

export default function App() {
    return (
        <NavigationContainer>
            <HomeTabs />
        </NavigationContainer>
    );
}