import { Pressable, Text, Linking, Alert, StyleSheet } from "react-native";

const INK = "#2B2724";

export default function ExploreButton({ link }) {
    const handleOpenURL = async () => {
        const url = link;
        try {
            const canOpen = await Linking.canOpenURL(url);
            if (!canOpen) {
                Alert.alert("Could not open link", "Please try again later.");
                return;
            }
            await Linking.openURL(url);
        } catch (error) {
            Alert.alert("Could not open link", "Please try again later.");
        }
    };

    return (
        <Pressable onPress={handleOpenURL} style={styles.button}>
            <Text style={{ color: INK, fontSize: 15, fontWeight: "bold" }}>Explore causes</Text>
        </Pressable>
    );

}

const styles = StyleSheet.create({
    button: {
        width: 200,
        borderWidth: 2,
        borderColor: INK,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 12,
    },
});