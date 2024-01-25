import { View, Text, StyleSheet, SafeAreaView, Image } from "react-native";
import { withSafeAreaInsets } from "react-native-safe-area-context";
import ClearButton from "../components/clearButton";
import LargeImage from "../components/largeImage";
const growth = require("../assets/Growth.png");

export default function Intro3Screen({ navigation, route }) {
    const { challenge } = route.params;
    const newChallenge = challenge.ID != 0 ? true : false;

    return (
        <SafeAreaView style={styles.container}>
            <LargeImage src={growth} />
            <View style={styles.hContainer} >
                <View style={[styles.container, styles.textContainer]}>
                    <Text style={[styles.text, styles.title]}>Why</Text>
                    <Text style={[styles.text, styles.body]}>A 1% improvement</Text>
                    <Text style={[styles.text, styles.body]}>everyday is a 37x</Text>
                    <Text style={[styles.text, styles.body]}>improvement a year!</Text>
                    <ClearButton title="Next" nav={navigation} destination={newChallenge ? "Challenge1" : "Home Tabs"} top={20} challenge={challenge} />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#9884BA",
        alignItems: "left",
        justifyContent: "center",
    },
    textContainer: {
        flex: 1,
        paddingLeft: "10%",
    },
    hContainer: {
        flexDirection: "row",
    },
    text: {
        color: "white",
        paddingLeft: 3,
    },
    title: {
        fontSize: 35,
        fontWeight: "bold",
    },
    body: {
        fontSize: 30,
        fontWeight: "normal",
    },
});