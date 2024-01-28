import { Pressable, Image, Keyboard, StyleSheet } from "react-native";

const downArrow = require("../assets/down_arrow.png");

export default function CloseKeyboard({ visible }) {
    if (!visible) return null;
    return(
        <Pressable onPress={() => {Keyboard.dismiss()}} style={styles.container}>
            <Image source={downArrow} style={styles.image} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "rgba(255, 200, 180, 0.6)",
        width: 50,
        height: 50,
        borderRadius: 15,
        borderWidth: 3,
        borderColor: "rgba(230, 230, 230, 1)",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        right: 10,
        top: "50%",
    },
    image: {
        width: 40,
        height: 40,
    }
});