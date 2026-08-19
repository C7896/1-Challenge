import { Pressable, Text, StyleSheet } from "react-native";

const INK = "#2B2724";

export default function LoginScreenButton( { title, nav, dest, background } ) {
    return(
        <Pressable style={[styles.buttoncontainer, {backgroundColor: background ? "#FFC0A2" : "transparent"}]} onPress={() => nav.navigate(dest)}>
            <Text style={[styles.buttontext, background && { color: INK }]}>{title}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    buttoncontainer: {
        width: 211,
        height: 56,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    buttontext: {
        color: "white",
        fontSize: 22,
        fontWeight: "bold",
    },
});