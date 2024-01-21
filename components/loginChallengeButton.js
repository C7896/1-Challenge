import { Pressable, Text, StyleSheet } from "react-native";

export default function LoginChallengeButton( { title, nav, dest, newChallenge, challenge } ) {
    return(
        <Pressable style={styles.container} onPress={() => nav.navigate(newChallenge ? "Challenge1" : dest, {navigation: nav, challenge: challenge,})}>
            <Text style={styles.text}>{title}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFC0A2",
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