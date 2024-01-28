import { SafeAreaView, View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";

import LargeImage from "../components/largeImage";
import ChallengeButton from "../components/challengeButton";

const message = require("../assets/message.png");

export default function Challenge2Screen({ navigation, route }) {
    const { challenge } = route.params;

    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);

    let first = true;

    const getTimeRemaining = () => {
        const now = new Date();

        setHours(now.getMinutes() != 0 ? 23 - now.getHours() : 24 - now.getHours());
        setMinutes(now.getMinutes() != 0 ? 60 - now.getMinutes() : 0);
    }

    useEffect(() => {
        if (first) {
            getTimeRemaining();
        }
        const interval = setInterval(() => getTimeRemaining(), 1000);

        return () => clearInterval(interval);
    }, []);

    return(
        <SafeAreaView style={styles.container}>
            <View style={[styles.container, {flex: 1}]}>
                <Text style={styles.subtitle}>{hours}:{minutes} left</Text>
            </View>
            <LargeImage src={message} />
            <View style={styles.textContainer}>
                <Text style={styles.title}>Challenge:</Text>
                <Text style={styles.body}>{challenge.challenge}</Text>
            </View>
            <ChallengeButton title="Let's GO!" nav={navigation} destination="Challenge3" challenge={challenge}/>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 2,
        backgroundColor: "#FF815E",
        justifyContent: "center",
        alignItems: "center",
    },
    textContainer: {
        flex: 2,
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "flex-start",
        marginHorizontal: 20,
    },
    title: {
        color: "white",
        fontSize: 30,
        fontWeight: "bold",
    },
    subtitle: {
        color: "white",
        fontSize: 25,
        fontWeight: "bold",
    },
    body: {
        color: "white",
        fontSize: 25,
        fontWeight: "normal",
    }
});