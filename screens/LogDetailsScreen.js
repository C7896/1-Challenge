import { SafeAreaView, View, Text, Image, TextInput, StyleSheet } from "react-native";

const topBlob = require("../assets/topBlob.png");


export default function LogDetailsScreen({ route }) {
    const { journal } = route.params;

    return(
        <View style={styles.container}>
            <Image source={topBlob} style={styles.image} />
            <SafeAreaView style={styles.clearContainer}>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>Challenge:</Text>
                    <Text style={styles.body}>{journal.challenge}</Text>
                </View>
                <View style={{flex: 0.5}} />
                <View style={[styles.textContainer, {flex: 6, flexWrap: "no-wrap",}]}>
                    <Text style={styles.body}>What did you do?</Text>
                    <TextInput
                        style={styles.questionInput}
                        defaultValue={journal.action}
                        readOnly
                        multiline
                    />
                    <Text style={styles.body}>How did it make you feel?</Text>
                    <TextInput
                        style={[styles.questionInput, {height: 300}]}
                        defaultValue={journal.reflection}
                        readOnly
                        multiline
                    />
                </View>
                <View style={{flex: 2.5}} />
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
    clearContainer: {
        flex: 2,
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        position: "absolute",
        width: "100%",
        height: "35%",
        bottom: "80%",
    },
    textContainer: {
        flex: 2,
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "flex-start",
        marginHorizontal: 20,
    },
    questionInput: {
        backgroundColor: "white",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        borderRadius: 15,
        width: 350,
        height: 50,
        paddingHorizontal: 10,
        marginBottom: 10,
        color: "black",
        fontSize: 20,
        fontWeight: "normal",
        shadowColor: "black",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        elevation: 5,
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