import { View, Text, ImageBackground, FlatList, Pressable, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";

import TabBar from "../components/tabBar";
import { MONTHS } from "../constants/fallbackChallenges";
import Journal from "../components/Journal";

import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";

const purpleBlob = require("../assets/purpleBlob.png");

export default function LogScreen( {navigation} ) {

    const [challengeLog, setChallengeLog] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const isFocused = useIsFocused();

    const getChallengeLog = async () => {
        setLoading(true);
        setLoadError(false);
        try {
            const user = auth.currentUser;
            if (user != null) {
                const journalDocs = collection(db, "users", user.uid, "journals");
                const journalQuery = await getDocs(journalDocs);
                const journals = journalQuery.docs.map(doc => ({ docId: doc.id, ...doc.data() }));
                // Sort by the day the entry is FOR, not the moment it was written.
                // Rewriting an entry updates its timestamp, which used to jump an
                // old day to the top of the list.
                const entryOrder = (j) => {
                    const m = MONTHS.indexOf(j.month);
                    return (j.year ?? 0) * 10000 + (m < 0 ? 0 : m) * 100 + (j.day ?? 0);
                };
                journals.sort((a, b) => entryOrder(b) - entryOrder(a));
                setChallengeLog(journals);
            } else {
                console.log("User is not signed in");
            }
        } catch (error) {
            console.error("Error loading challenge log: ", error);
            setLoadError(true);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!isFocused) {
            return;
        }
        getChallengeLog();
    }, [isFocused]);

    const setFontSize = (challenge) => {
        const challengeLength = challenge.length;
        if (challengeLength < 40) {
            return 20;
        } else if (challengeLength < 70) {
            return 18;
        } else if (challengeLength < 100) {
            return 16;
        }
        return 14;
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
                    style={styles.list}
                    contentContainerStyle={styles.listContent}
                    data={challengeLog}
                    renderItem={({ item, index }) => (
                        <Journal
                        journal={item}
                        color={colors[index % 6]}
                        size={setFontSize(item.challenge)}
                        onPress={navigateToLogDetails}
                        />
                    )}
                    keyExtractor={(item) => item.docId}
                    ItemSeparatorComponent={<View style={{height: 5}} />}
                    ListEmptyComponent={
                        loading ? (
                            <Text style={styles.text}>Loading...</Text>
                        ) : loadError ? (
                            <Pressable onPress={getChallengeLog}>
                                <Text style={styles.text}>Couldn't load. Tap to retry.</Text>
                            </Pressable>
                        ) : (
                            <Text style={styles.text}>No past challenges</Text>
                        )
                    }
                />
            </View>
            <View style={{ flex: 5 }} />
            <TabBar nav={navigation} onLight />
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
        width: "100%",
        justifyContent: "center",
    },
    list: {
        width: "100%",
    },
    listContent: {
        paddingHorizontal: 16,
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