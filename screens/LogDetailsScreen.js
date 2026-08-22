import { SafeAreaView, View, Text, Image, ScrollView, StyleSheet } from "react-native";
import React, { useEffect } from "react";

const topBlob = require("../assets/topBlob.png");


export default function LogDetailsScreen({ navigation, route }) {
    const { journal } = route.params ?? {};

    useEffect(() => {
        if (!journal) {
            navigation.popTo("Home");
        }
    }, [journal]);

    if (!journal) {
        return null;
    }

    return(
        <View style={styles.container}>
            <Image source={topBlob} style={styles.image} />
            <SafeAreaView style={styles.safe}>
                {/* A read-only page, so the answers are plain text that grows with
                    its content inside one scrolling page. They used to be
                    fixed-height read-only TextInputs, which scrolled internally
                    with no scrollbar or fade, so a long answer looked truncated
                    and there was no way to tell the rest was still there. */}
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator
                >
                    <Text style={styles.title}>Challenge:</Text>
                    <Text style={styles.body}>{journal.challenge}</Text>

                    <Text style={[styles.body, styles.question]}>What did you do?</Text>
                    <View style={styles.answerBox}>
                        <Text style={styles.answer}>{journal.action}</Text>
                    </View>

                    <Text style={[styles.body, styles.question]}>How did it make you feel?</Text>
                    <View style={styles.answerBox}>
                        <Text style={styles.answer}>{journal.reflection}</Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 2,
        backgroundColor: "#FF815E",
        justifyContent: "center",
        alignItems: "center",
    },
    safe: {
        flex: 1,
        width: "100%",
    },
    scroll: {
        flex: 1,
        width: "100%",
    },
    scrollContent: {
        paddingHorizontal: 20,
        // clears the blob artwork at the top of the screen
        paddingTop: 150,
        paddingBottom: 40,
    },
    image: {
        position: "absolute",
        width: "100%",
        height: "35%",
        bottom: "80%",
    },
    question: {
        marginTop: 18,
        marginBottom: 8,
    },
    answerBox: {
        backgroundColor: "white",
        borderRadius: 15,
        paddingHorizontal: 14,
        paddingVertical: 12,
        shadowColor: "black",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        elevation: 5,
    },
    answer: {
        color: "#2B2724",
        fontSize: 18,
        lineHeight: 24,
    },
    title: {
        color: "white",
        fontSize: 30,
        fontWeight: "bold",
        shadowColor: "black",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        elevation: 5,
    },
    body: {
        color: "white",
        fontSize: 25,
        fontWeight: "normal",
        shadowColor: "black",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        elevation: 5,
    }
});
