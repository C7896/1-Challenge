import { SafeAreaView, View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";

import LargeImage from "../components/largeImage";
import ChallengeButton from "../components/challengeButton";

const message = require("../assets/message.png");

export default function Challenge2Screen({ navigation, route }) {
    const { challenge } = route.params ?? {};

    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);

    let first = true;

    const getTimeRemaining = () => {
        const now = new Date();
      
        // Calculate hours and minutes
        const hours = now.getMinutes() !== 0 ? 23 - now.getHours() : 24 - now.getHours();
        let minutes = now.getMinutes() !== 0 ? 60 - now.getMinutes() : 0;
      
        // Format minutes to always be two digits
        minutes = minutes < 10 ? `0${minutes}` : minutes;
      
        // Update state
        setHours(hours);
        setMinutes(minutes);
      };

    useEffect(() => {
        if (first) {
            getTimeRemaining();
        }
        const interval = setInterval(() => getTimeRemaining(), 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!challenge) {
            navigation.popTo("Home");
        }
    }, [challenge]);

    if (!challenge) {
        return null;
    }

    return(
        <SafeAreaView style={styles.container}>
            <View style={[styles.container, {flex: 1}]}>
                <Text style={styles.subtitle}>{hours > 0 ? `${hours}h ${minutes}m left` : `${minutes}m left`}</Text>
            </View>
            <LargeImage src={message} />
            <View style={styles.textContainer}>
                <Text style={styles.title}>Challenge:</Text>
                <Text style={styles.body}>{challenge.challenge}</Text>
            </View>
            {/* lifted clear of the floating tab bar, which now sits on this screen too */}
            <View style={styles.ctaBlock}>
                <ChallengeButton title="Let's GO!" nav={navigation} destination="Challenge3" challenge={challenge}/>
            </View>
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
    ctaBlock: {
        alignItems: "center",
        marginBottom: 110,
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
