import { View, Text, StyleSheet } from "react-native";
import LargeImage from "../components/largeImage";
import LoginScreenButton from "../components/loginScreenButton";
const location = require("../assets/Location.png");

export default function Login0Screen( {navigation} ) {
    return(
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <LargeImage src={location}/>
                <Text style={styles.title}>1% Challenge</Text>
            </View>
            <View style={styles.container}>
                <LoginScreenButton title="Login" nav={navigation} dest="Login1" background={true} />
                <LoginScreenButton title="Sign up" nav={navigation} dest="Sign up" background={false} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FF815E",
        justifyContent: "center",
        alignItems: "center",
    },
    topContainer: {
        flex: 2,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    title: {
        color: "white",
        fontSize: 50,
        fontWeight: "bold",
    },
});