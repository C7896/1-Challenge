import { Pressable, Text, StyleSheet } from "react-native";

export default function LoginScreenButton( { title, nav, dest, background } ) {
    return(
        <Pressable style={[styles.container, {backgroundColor: background ? "#FFC0A2" : "transparent"}]} onPress={() => nav.navigate(dest)}>
            <Text style={styles.text}>{title}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 211,
        height: 56,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        color: "white",
        fontSize: 22,
        fontWeight: "bold",
    },
});