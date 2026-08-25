import { View, Text, StyleSheet, SafeAreaView, Image } from "react-native";
import { withSafeAreaInsets } from "react-native-safe-area-context";
import ClearButton from "../components/clearButton";
import LargeImage from "../components/largeImage";
import IntroDots from "../components/introDots";
const relationship = require("../assets/Relationship.png");

export default function Intro2Screen({ navigation }) {

    return (
        <SafeAreaView style={styles.container}>
            <LargeImage src={relationship} />
            <View style={styles.hContainer} >
                <View style={[styles.container, styles.textContainer]}>
                    <Text style={[styles.text, styles.title]}>How</Text>
                    <Text style={[styles.text, styles.body]}>Daily challenges that</Text>
                    <Text style={[styles.text, styles.body]}>improve you and</Text>
                    <Text style={[styles.text, styles.body]}>those around you.</Text>
                    <View style={styles.ctaBlock}>
                        <IntroDots active={1} color={INK} />
                        <ClearButton title="Next" nav={navigation} destination="Intro3" top={12} onLight/>
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
        backgroundColor: "#E4A7C1",
        alignItems: "center",
        justifyContent: "center",
    },
    textContainer: {
        flex: 1,
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