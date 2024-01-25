import { Pressable, Text, StyleSheet } from "react-native";

export default function ClearButton( {title, nav, destination, top, challenge} ) {
    return (
        <Pressable style={[styles.buttonContainer, {marginTop: top}]} onPress={() => nav.navigate(destination, {challenge: challenge})}>
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