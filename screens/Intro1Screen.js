import { View, Text, StyleSheet, SafeAreaView, Pressable } from "react-native";
import { withSafeAreaInsets } from "react-native-safe-area-context";
import ClearButton from "../components/clearButton";

export default function Intro1Screen({ navigation }) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}/>
            <View style={[styles.container, styles.textContainer]}>
                <Text style={[styles.text, styles.title]}>Our Mission</Text>
                <Text style={[styles.text, styles.body]}>Improve the world</Text>
                <Text style={[styles.text, styles.body]}>by 1% everyday.</Text>
                <ClearButton title="Next" nav={navigation} destination="Intro2" />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFCF5B",
        alignItems: "left",
        justifyContent: "center",
    },
    textContainer: {
        flex: 1,
        paddingLeft: "10%",
    },
    text: {
        color: "white",
        paddingLeft: 3,
    },
    title: {
        fontSize: 35,
        fontWeight: "bold",
    },
    body: {
        fontSize: 30,
        fontWeight: "normal",
    },
});