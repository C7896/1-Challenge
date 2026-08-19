import { View, Text, StyleSheet, SafeAreaView, Image } from "react-native";
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
                    <Text style={[styles.text, styles.body]}>by 1% every day.</Text>
                    <ClearButton title="Next" nav={navigation} destination="Intro2" top={20} onLight/>
                </View>
            </View>
        </SafeAreaView>
    );
}

const INK = "#2B2724";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFCF5B",
        alignItems: "center",
        justifyContent: "space-evenly",
    },
    textContainer: {
        flexGrow: 6,
        alignItems: "flex-start",
        paddingLeft: "10%",
    },
    hContainer: {
        flexDirection: "row",
    },
    text: {
        color: INK,
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