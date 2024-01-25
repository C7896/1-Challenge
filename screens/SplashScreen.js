import { View, Text, StyleSheet, SafeAreaView, Pressable, useWindowDimensions } from "react-native";
import React, { useEffect } from "react";

export default function SplashScreen({ navigation }) {

    const windowWidth = useWindowDimensions().width

    useEffect(() => {
        const delayNavigation = setTimeout(() => {
          // Navigate to the desired screen after 1 second
          navigation.navigate("Home Tabs"); // Replace 'YourScreen' with the actual screen name
        }, 1000);
    
        // Cleanup the timeout when the component unmounts
        return () => clearTimeout(delayNavigation);
      }, [navigation]);

    return (
        <SafeAreaView style={styles.container}>
            <Pressable onPress={() => navigation.navigate("Login0")}>
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