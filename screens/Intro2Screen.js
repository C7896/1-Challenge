import { View, Text, StyleSheet, SafeAreaView, Image } from "react-native";
import { withSafeAreaInsets } from "react-native-safe-area-context";
import ClearButton from "../components/clearButton";
import LargeImage from "../components/largeImage";
import IntroDots from "../components/introDots";
const relationship = require("../assets/Relationship.png");

export default function Intro2Screen({ navigation }) {

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.group}>
                <LargeImage src={relationship} trimBottom={0.09} />
                <Text style={[styles.text, styles.title]}>How</Text>
                <Text style={[styles.text, styles.body]}>Daily challenges that</Text>
                <Text style={[styles.text, styles.body]}>improve you and</Text>
                <Text style={[styles.text, styles.body]}>those around you.</Text>
            </View>
            <View style={styles.ctaBlock}>
                <IntroDots active={1} color={INK} />
                <ClearButton title="Next" nav={navigation} destination="Intro3" top={12} onLight/>
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
    group: {
        // image and copy sit together as one block, centred on the screen
        alignItems: "center",
        justifyContent: "center",
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