import { View, Text, StyleSheet, SafeAreaView, Image } from "react-native";
import ClearButton from "../components/clearButton";
import LargeImage from "../components/largeImage";
import IntroDots from "../components/introDots";
const joy = require("../assets/Joy.png");

export default function Intro1Screen({ navigation }) {

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.group}>
                <LargeImage src={joy} />
                <Text style={[styles.text, styles.title]}>Our Mission</Text>
                <Text style={[styles.text, styles.body]}>Improve the world</Text>
                <Text style={[styles.text, styles.body]}>by 1% every day.</Text>
            </View>
            <View style={styles.ctaBlock}>
                <IntroDots active={0} color={INK} />
                <ClearButton title="Next" nav={navigation} destination="Intro2" top={12} onLight/>
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
        justifyContent: "flex-start",
        paddingTop: 56,
    },
    group: {
        alignItems: "center",
        marginTop: 12,
    },
    ctaBlock: {
        // pinned to the bottom edge, independent of how tall the copy is
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 28,
        alignItems: "center",
    },
    text: {
        color: INK,
        textAlign: "center",
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