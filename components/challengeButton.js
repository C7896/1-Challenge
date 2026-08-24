import { Pressable, Text, StyleSheet } from "react-native";

export default function ChallengeButton( {title, nav, destination, challenge} ) {
    return (
        <Pressable style={styles.buttonContainer} onPress={() => nav.navigate(destination, {challenge: challenge})}>
            <Text style={styles.text}>{title}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        minHeight: 62,
        borderWidth: 2,
        borderColor: "white",
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 42,
        paddingVertical: 12,
        marginTop: 10,
    },
    text: {
        color: "white",
        fontSize: 30,
        lineHeight: 38,
        // an explicit line height and no vertical clipping: the label was being
        // cut in half whenever the surrounding box got squeezed
        includeFontPadding: false,
        textAlignVertical: "center",
        fontWeight: "bold"
    },
});