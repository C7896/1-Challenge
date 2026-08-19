import { View, Pressable, Image, StyleSheet } from "react-native";
const homeIcon = require("../assets/home.png");
const logIcon = require("../assets/book.png");

export default function TabBar( {nav} ) {
    return (
        <View style={styles.container}>
            <Pressable onPress={() => {nav.popTo("Home")}} accessibilityRole="button" accessibilityLabel="Home">
                <Image source={homeIcon} style={styles.image}/>
            </Pressable>
            <Pressable onPress={() => {nav.popTo("Log")}} accessibilityRole="button" accessibilityLabel="Past challenges">
                <Image source={logIcon} style={styles.image}/>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 150,
        height: 55,
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        borderRadius: 100,
        position: "absolute",
        alignSelf: "center",
        bottom: 50,
    },
    image: {
        width: 35,
        height: 35,
    },
});