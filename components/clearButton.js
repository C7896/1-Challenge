import { Pressable, Text, StyleSheet } from "react-native";

export default function ClearButton( {title, nav, destination, top, reset} ) {
    const handlePress = () => {
        if (reset) {
            // clear the stack so completed flows can't be swiped/navigated back into
            nav.reset({ index: 0, routes: [{ name: destination }] });
        } else {
            nav.navigate(destination);
        }
    };
    return (
        <Pressable style={[styles.buttonContainer, {marginTop: top}]} onPress={handlePress}>
            <Text style={styles.text}>{title}</Text>
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
    text: {
        color: "white",
        fontSize: 30,
        fontWeight: "bold"
    },
});