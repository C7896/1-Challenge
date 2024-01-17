import { View, SafeAreaView, Text, ImageBackground, FlatList, StyleSheet } from "react-native";
import TabBar from "../components/tabBar";
import Journal from "../components/Journal";
import NewChallengeButton from "../components/newChallenge";
import pastChallengesList from "../past-challenges.json";
const purpleBlob = require("../assets/purpleBlob.png");

export default function LogScreen( {navigation} ) {

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let day = new Date().getDate();
    let monthIndex = new Date().getMonth();
    let month = months[monthIndex];

    return (
        <View style={styles.purpleContainer}>
            <View style={{ flex: 7 }} />
            <View style={styles.listContainer}>
                <FlatList
                    data={pastChallengesList.reverse()}
                    renderItem={({ item }) => {
                        return (
                            <Journal month={item.month} day={item.day} challenge={item.challenge} color={item.color} />
                        );
                    }}
                    keyExtractor={(item) => item.id}
                    ItemSeparatorComponent={<View style={{ height: 8 }} />}
                    ListEmptyComponent={<Text style={styles.text}>No past challenges</Text>}
                />
            </View>
            <View style={{ flex: 5 }} />
            <ImageBackground source={purpleBlob} style={styles.image}>
                    <Text style={[styles.title, {paddingBottom: "50%"}]}>Past Challenges</Text>
            </ImageBackground>
            <TabBar nav={navigation} />

            <NewChallengeButton nav={navigation} month={month} day={day} />
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
        bottom: "55%",
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