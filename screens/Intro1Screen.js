import { View, Text, Image, Pressable, StyleSheet } from "react-native";

import IntroDots from "../components/introDots";
import { useIntroLayout } from "../lib/introLayout";

const joy = require("../assets/Joy.png");

const INK = "#2B2724";

export default function Intro1Screen({ navigation }) {
    const layout = useIntroLayout();

    return (
        <View style={styles.container}>
            <Image source={joy} style={layout.image} resizeMode="contain" accessible={false} />

            <View style={layout.stack}>
                <Text style={[styles.text, layout.title]}>Our Mission</Text>
                <Text style={[styles.text, layout.body]}>Improve the world</Text>
                <Text style={[styles.text, layout.body]}>by 1% every day.</Text>
                <IntroDots style={layout.dots} active={0} color={INK} />
                <Pressable
                    style={[styles.button, layout.button]}
                    onPress={() => navigation.navigate("Intro2")}
                    accessibilityRole="button"
                >
                    <Text style={[styles.buttonText, layout.buttonText]}>Next</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFCF5B",
    },
    // ink rather than the mock's white: white on this yellow measures about
    // 1.7 to 1, which the contrast check rejects and which is hard to read
    text: {
        color: INK,
    },
    button: {
        borderColor: INK,
    },
    buttonText: {
        color: INK,
    },
});
