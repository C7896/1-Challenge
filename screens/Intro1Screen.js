import { View, Text, StyleSheet, SafeAreaView, Image } from "react-native";
import { withSafeAreaInsets } from "react-native-safe-area-context";
import ClearButton from "../components/clearButton";
import LargeImage from "../components/largeImage";
const joy = require("../assets/Joy.png");

export default function Intro1Screen({ navigation }) {
    return (
        <SafeAreaView style={styles.container}>
            <LargeImage src={joy} />
            <View style={styles.hContainer} >
                <View style={[styles.container, styles.textContainer]}>
                    <Text style={[styles.text, styles.title]}>Our Mission</Text>
                    <Text style={[styles.text, styles.body]}>Improve the world</Text>
                    <Text style={[styles.text, styles.body]}>by 1% everyday.</Text>
                    <ClearButton title="Next" nav={navigation} destination="Intro2" top={20} />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFCF5B",
        alignItems: "center",
        justifyContent: "space-evenly",
    },
    textContainer: {
        flexGrow: 6,
        alignItems: "left",
        paddingLeft: "10%",
    },
    hContainer: {
        flexDirection: "row",
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