import { View, Pressable, Text, Linking, Alert, StyleSheet } from "react-native";
import { PRIVACY_POLICY_URL, SUPPORT_EMAIL } from "../constants/links";

const INK = "#2B2724";

async function openLink(url) {
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
}

export default function PolicyLinks({ style, onLight, small, color }) {
    const smallStyle = small && [styles.linkSmall, color && { color }];
    return (
        <View style={[styles.row, style]}>
            <Pressable onPress={() => openLink(PRIVACY_POLICY_URL)}>
                <Text style={[styles.link, onLight && styles.linkLight, smallStyle]}>Privacy Policy</Text>
            </Pressable>
            <Pressable onPress={() => openLink(`mailto:${SUPPORT_EMAIL}`)}>
                <Text style={[styles.link, onLight && styles.linkLight, smallStyle]}>Contact</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    link: {
        color: "white",
        fontSize: 13,
        textDecorationLine: "underline",
    },
    linkLight: {
        color: INK,
    },
    linkSmall: {
        fontSize: 11,
        textDecorationLine: "none",
    },
});
