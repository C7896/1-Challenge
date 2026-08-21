import { Pressable, Text, Linking, Alert, StyleSheet } from "react-native";

const INK = "#2B2724";

export default function ExploreButton({ link, label = "Explore causes", onDark }) {
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
        <Pressable onPress={handleOpenURL} style={[styles.button, onDark && styles.buttonOnDark]}>
            <Text style={[styles.label, onDark && styles.labelOnDark]}>{label}</Text>
        </Pressable>
    );

}

const styles = StyleSheet.create({
    label: {
        color: INK,
        fontSize: 15,
        fontWeight: "bold",
    },
    labelOnDark: {
        color: "white",
    },
    buttonOnDark: {
        // the compact pill the Home design uses; the default width is sized for
        // the longer "Explore causes" label on Profile
        width: 128,
        borderColor: "white",
    },
    button: {
        width: 200,
        borderWidth: 2,
        borderColor: INK,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 9,
    },
});