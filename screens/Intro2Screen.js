import { View, Text, StyleSheet, SafeAreaView, Image } from "react-native";
import { withSafeAreaInsets } from "react-native-safe-area-context";
import ClearButton from "../components/clearButton";
import LargeImage from "../components/largeImage";
const relationship = require("../assets/Relationship.png");

export default function Intro2Screen({ navigation }) {

    return (
        <SafeAreaView style={styles.container}>
            <LargeImage src={relationship} />
            <View style={styles.hContainer} >
                <View style={[styles.container, styles.textContainer]}>
                    <Text style={[styles.text, styles.title]}>How</Text>
                    <Text style={[styles.text, styles.body]}>Daily challenges that</Text>
                    <Text style={[styles.text, styles.body]}>improve you and</Text>
                    <Text style={[styles.text, styles.body]}>those around you.</Text>
                    <ClearButton title="Next" nav={navigation} destination="Intro3" top={20}/>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#E4A7C1",
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