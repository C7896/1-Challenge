import { View, Text, ImageBackground, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import React, { useEffect, useState, useCallback } from "react";

import TabBar from "../components/tabBar";
import Journal from "../components/Journal";

import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../firebase-config";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const purpleBlob = require("../assets/purpleBlob.png");

export default function LogScreen( {navigation} ) {

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    const [challengeLog, setChallengeLog] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getChallengeLog = async () => {
            const user = auth.currentUser;
            if (user != null) {
                const journalDocs = collection(db, "users", user.uid, "journals");
                const journalQuery = await getDocs(journalDocs);
                const journals = journalQuery.docs.map(doc => doc.data());
                setChallengeLog(journals.reverse());
            } else {
                console.log("User is not signed in");
            }
            setLoading(false);
        }

        getChallengeLog();
    }, [challengeLog, loading]);

    const setFontSize = (challenge) => {
        const challengeLength = challenge.length;
        if (challengeLength < 40) {
            return 20;
        } else if (challengeLength < 70) {
            return 18;
        } else if (challengeLength < 100) {
            return 16;
        }
    }

    const colors = ["#FF815E", "#FFCF5B", "#DCE18B", "#A1D5AE", "#92C1D2", "#4969A9"];

    const navigateToLogDetails = (selectedJournal) => {
        console.log("Journal ", selectedJournal.uid, " pressed");
        navigation.navigate("Log Details", { journal: selectedJournal });
    };


    return (
        <View style={styles.purpleContainer}>
            <ImageBackground source={purpleBlob} style={styles.image}>
                <Text style={[styles.title, {paddingBottom: "50%"}]}>Past Challenges</Text>
            </ImageBackground>
            <View style={{ flex: 7 }} />
            <View style={styles.listContainer}>
                <FlatList
                    data={challengeLog}
                    renderItem={({ item, index }) => (
                        <Journal
                        journal={item}
                        color={colors[index % 6]}
                        size={setFontSize(item.challenge)}
                        onPress={navigateToLogDetails}
                        />
                    )}
                    keyExtractor={(item) => item.timestamp}
                    ItemSeparatorComponent={<View style={{height: 5}} />}
                    ListEmptyComponent={loading ? <Text style={styles.text}>Loading...</Text> : <Text style={styles.text}>No past challenges</Text>}
                />
            </View>
            <View style={{ flex: 5 }} />
            <TabBar nav={navigation} />
        </View>
    );
}

const styles = StyleSheet.create({
    purpleContainer: {
        flex: 1,
        backgroundColor: "#9884BA",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
    },
    listContainer: {
        flex: 22,
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        position: "absolute",
        width: "100%",
        height: "45%",
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        color: "white",
        fontSize: 30,
        fontWeight: "bold",
    },
    text: {
        color: "white",
        fontSize: 20,
        fontWeight: "normal",
    },
});