import { View, Text, StyleSheet } from "react-native";
import TabBar from "../components/tabBar";

const LogScreen = ( {navigation} ) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>LogScreen</Text>
            <TabBar nav={navigation} />
        </View>
    );
};

export default LogScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
});