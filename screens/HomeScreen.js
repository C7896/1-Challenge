import { SafeAreaView, View, Text, ImageBackground, Image, Pressable, StyleSheet } from "react-native";
import TabBar from "../components/tabBar";
import SignOutButton from "../components/signOutButton";

const blob = require("../assets/blob.png");
const blueCloud = require("../assets/blue_cloud.png");
const redCloud = require("../assets/red_cloud.png");
const yellowCloud = require("../assets/yellow_cloud.png");
const travels = require("../assets/Travels.png");
const globe = require("../assets/Globe.png");

export default function HomeScreen( {navigation} ) {
    return (
        <View style={styles.orangeContainer} >
            <SafeAreaView style={styles.orangeContainer} >
                <View style={{ flex: 1 }}>
                    <Text style={styles.title}>1% Challenge</Text>
                </View>
            </SafeAreaView>
            <SafeAreaView style={styles.greenContainer} >
                <Image source={globe} style={styles.globe} />
                <View style={{ marginTop: 50, marginRight: 25 }}>
                    <Text style={styles.subtitle}>We love you!</Text>
                    <Text style={styles.text}>Thank you for making</Text>
                    <Text style={styles.text}>the world a better place!</Text>
                    <Pressable style={styles.button}>
                        <Text style={{ color: "white", fontSize: 15, fontWeight: "bold" }}>Explore more</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
            <ImageBackground source={blob} style={styles.image}>
                    <ImageBackground source={redCloud} style={[styles.cloud, styles.red]}>
                        <Text style={[styles.title, {right: "18%"}]}>10</Text>
                        <Text style={[styles.subsubtitle, {right: "18%"}]}>day streak</Text>
                    </ImageBackground>
                    <ImageBackground source={yellowCloud} style={[styles.cloud, styles.yellow]}>
                        <Text style={[styles.title, {right: "18%"}]}>1.2x</Text>
                        <Text style={[styles.text, {right: "18%"}]}>personal</Text>
                        <Text style={[styles.text, {right: "18%"}]}>improvement</Text>
                    </ImageBackground>
                    <ImageBackground source={blueCloud} style={[styles.cloud, styles.blue]}>
                    <Text style={[styles.title, {right: "18%"}]}>20</Text>
                        <Text style={[styles.text, {right: "18%"}]}>challenges</Text>
                        <Text style={[styles.text, {right: "18%"}]}>completed</Text>
                    </ImageBackground>
                    <Image source={travels} style={styles.travels} />
            </ImageBackground>
            <SignOutButton navigation={navigation} />
            <TabBar nav={navigation} />
        </View>
    );
}

const styles = StyleSheet.create({
    orangeContainer: {
        flex: 1,
        backgroundColor: "#FF815E",
        alignItems: "center",
        justifyContent: "center",
    },
    image: {
        position: "absolute",
        bottom: "15%",
        width: "100%",
        height: "75%",
        justifyContent: "space-around",
        alignItems: "center",
    },
    greenContainer: {
        flex: 1,
        width: "100%",
        backgroundColor: "#A1D5AE",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    button: {
        borderWidth: 2,
        borderColor: "white",
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        paddingHoriontal: 12,
        paddingVertical: 10,
        marginTop: 20,
    },
    cloud: {
        width: "65%",
        height: 133,
        justifyContent: "center",
        alignItems: "center",
    },
    red: {
        top: "15%",
        right: "20%",
    },
    yellow: {
        top: "15%",
        right: "10%",
    },
    blue: {
        top: "2%",
        left: "41%",
    },
    travels: {
        width: "50%",
        height: 180,
        bottom: "56%",
        left: "22%",
    },
    globe: {
        width: "45%",
        height: 150,
        marginTop: 50,
    },
    title: {
        color: "white",
        fontSize: 35,
        fontWeight: "bold",
        top: "1.5%",
    },
    subtitle: {
        color: "white",
        fontSize: 30,
        fontWeight: "bold",
    },
    subsubtitle: {
        color: "white",
        fontSize: 25,
        fontWeight: "bold",
    },
    text: {
        color: "white",
        fontSize: 20,
        fontWeight: "normal",
    },
});