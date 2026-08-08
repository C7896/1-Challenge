import { Pressable, Text, StyleSheet } from "react-native";

export default function LoginChallengeButton( { title, nav, dest, newChallenge, challenge } ) {
    return(
        <Pressable style={styles.buttoncontainer} onPress={() => nav.navigate(newChallenge ? "Challenge1" : dest, {navigation: nav, challenge: challenge,})}>
            <Text style={styles.buttontext}>{title}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    buttoncontainer: {
        backgroundColor: "#FFC0A2",
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