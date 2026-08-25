import { View, Text, Image, Pressable, StyleSheet } from "react-native";

import IntroDots from "../components/introDots";
import { useIntroLayout } from "../lib/introLayout";

const relationship = require("../assets/Relationship.png");

const INK = "#2B2724";

export default function Intro2Screen({ navigation }) {
    const layout = useIntroLayout();

    return (
        <View style={styles.container}>
            <Image source={relationship} style={layout.image} resizeMode="contain" accessible={false} />

            <View style={layout.stack}>
                <Text style={[styles.text, layout.title]}>How</Text>
                <Text style={[styles.text, layout.body]}>Daily challenges that</Text>
                <Text style={[styles.text, layout.body]}>improve you and</Text>
                <Text style={[styles.text, layout.body]}>those around you.</Text>
                <IntroDots style={layout.dots} active={1} color={INK} />
                <Pressable
                    style={[styles.button, layout.button]}
                    onPress={() => navigation.navigate("Intro3")}
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
        backgroundColor: "#E4A7C1",
    },
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
