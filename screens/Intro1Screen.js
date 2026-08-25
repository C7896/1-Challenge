import { View, Text, StyleSheet, SafeAreaView, Image } from "react-native";
import ClearButton from "../components/clearButton";
import LargeImage from "../components/largeImage";
import IntroDots from "../components/introDots";
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
                    <View style={styles.ctaBlock}>
                        <IntroDots active={0} color={INK} />
                        <ClearButton title="Next" nav={navigation} destination="Intro2" top={12} onLight/>
                    </View>
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
        paddingTop: 56,
    },
    textContainer: {
        flex: 1,
        alignItems: "center",
        marginTop: 12,
    },
    ctaBlock: {
        // pushed to the bottom of the screen rather than sitting under the text
        marginTop: "auto",
        alignSelf: "center",
        alignItems: "center",
        marginBottom: 28,
    },
    hContainer: {
        flex: 1,
        flexDirection: "row",
        alignSelf: "stretch",
        justifyContent: "center",
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