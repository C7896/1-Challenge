import { ActivityIndicator, View, Text, SafeAreaView, StyleSheet } from "react-native";
import { useEffect } from "react";
import LargeImage from "../components/largeImage";
const location = require("../assets/Location.png");

export default function Login0Screen( {navigation} ) {
    useEffect(() => {
        const timer = setTimeout(() => navigation.replace("Sign up"), 900);
        return () => clearTimeout(timer);
    }, [navigation]);

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <LargeImage src={location}/>
                <Text style={styles.title}>1% Challenge</Text>
            </View>
            <ActivityIndicator style={styles.loader} size="small" color="#FFFFFF" />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FF815E",
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        alignItems: "center",
        justifyContent: "center",
    },
    loader: {
        position: "absolute",
        bottom: 64,
    },
    title: {
        color: "white",
        fontSize: 50,
        fontWeight: "bold",
        marginTop: 20,
    },
});
