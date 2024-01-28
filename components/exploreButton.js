import { Pressable, Text, Linking, StyleSheet } from "react-native";


export default function ExploreButton({ link }) {
    const handleOpenURL = () => {
        console.log("pressed");
        const url = link; // Replace with your desired URL
        Linking.openURL(url).catch((err) => console.error('Error opening URL:', err));
    };

    return (
        <Pressable onPress={handleOpenURL} style={styles.button}>
            <Text style={{ color: "white", fontSize: 15, fontWeight: "bold" }}>Explore more</Text>
        </Pressable>
    );

}

const styles = StyleSheet.create({
    button: {
        width: 200,
        borderWidth: 2,
        borderColor: "white",
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        paddingHoriontal: 12,
        paddingVertical: 10,
        position: "absolute",
        right: 36,
        bottom: 140,
    },
});