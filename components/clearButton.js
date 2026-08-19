import { Pressable, Text, StyleSheet } from "react-native";

const INK = "#2B2724";

export default function ClearButton( {title, nav, destination, top, reset, onLight} ) {
    const handlePress = () => {
        if (reset) {
            // clear the stack so completed flows can't be swiped/navigated back into
            nav.reset({ index: 0, routes: [{ name: destination }] });
        } else {
            nav.navigate(destination);
        }
    };
    return (
        <Pressable style={[styles.buttonContainer, onLight && styles.buttonContainerLight, {marginTop: top}]} onPress={handlePress}>
            <Text style={[styles.text, onLight && styles.textLight]}>{title}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        borderWidth: 2,
        borderColor: "white",
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 42,
        paddingVertical: 12,
    },
    buttonContainerLight: {
        borderColor: INK,
    },
    text: {
        color: "white",
        fontSize: 30,
        fontWeight: "bold"
    },
    textLight: {
        color: INK,
    },
});