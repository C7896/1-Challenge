import { View, Text, StyleSheet, SafeAreaView, Pressable, useWindowDimensions } from "react-native";
import { withSafeAreaInsets } from "react-native-safe-area-context";

export default function SplashScreen({ navigation }) {

    const windowWidth = useWindowDimensions().width

    return (
        <SafeAreaView style={styles.container}>
            <Pressable onPress={() => navigation.navigate("Intro1")}>
                <View style={styles.container}>
                    <Text style={[styles.title, {fontSize: windowWidth > 500 ? 70 : 35}]}>1%</Text>
                    <Text style={[styles.title, {fontSize: windowWidth > 500 ? 70 : 35}]}>Challenge</Text>
                </View>
            </Pressable>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#A1D5AE",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        color: "white",
        fontWeight: "bold",
    },
});