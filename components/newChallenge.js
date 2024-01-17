import { Pressable, Text, Image, StyleSheet } from "react-native";
import pastChallengesList from "../past-challenges.json";
import newChallengesList from "../next-challenges.json";
const challenge = require("../assets/splash.png");

export default function NewChallengeButton( {nav, month, day} ) {

    if (pastChallengesList[pastChallengesList.length-1].month === month) {
        if (pastChallengesList[pastChallengesList.length-1].day === day) {
            return (null);
        }
    }

    const nextChallenge = newChallengesList.find(item => {
        if (item.month !== month || item.day !== day) {
            return false;
        }
        return true;
    });

    return (
        <Pressable style={styles.container} onPress={() => nav.navigate("Challenge1", {navigation: nav, challenge: nextChallenge,})}>
            <Image source={challenge} style={styles.image} />
            <Text style={styles.text}>New</Text>
            <Text style={styles.text}>Challenge!</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        left: "69%",
        bottom: "70%",
        width: 125,
        height: 100,
        backgroundColor: "#FFCF5B",
        justifyContent: "center",
        alignItems: "center",
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        shadowColor: "#333333",
        shadowOffset: {
            width: 6,
            height: 6,
        },
        shadowOpacity: 0.6,
        shadowRadius: 4,
        elevation: 10,
    },
    image: {
        width: 50,
        height: 50,
    },
    text: {
        color: "white",
        fontSize: 15,
        fontWeight: "bold",
    },
});