import { View, Text, StyleSheet, SafeAreaView, Button } from "react-native";
import { withSafeAreaInsets } from "react-native-safe-area-context";
import ClearButton from "../components/clearButton";

export default function Intro3Screen({ navigation }) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}/>
            <View style={[styles.container, styles.textContainer]}>
                <Text style={[styles.text, styles.title]}>Why</Text>
                <Text style={[styles.text, styles.body]}>A 1% improvement</Text>
                <Text style={[styles.text, styles.body]}>everyday is a 37x</Text>
                <Text style={[styles.text, styles.body]}>improvement a year!</Text>
                <ClearButton title="Next" nav={navigation} destination="Home Tabs" />
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