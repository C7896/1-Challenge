import { View, Text, Pressable, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import LargeImage from "../components/largeImage";
import PolicyLinks from "../components/policyLinks";
import BackButton from "../components/backButton";
import { AUTH_SCHEMES } from "../constants/theme";

const createAccount = require("../assets/auth-create-account.png");

const scheme = AUTH_SCHEMES.green;

export default function SignupStart( {navigation} ) {
    return(
        <SafeAreaView style={styles.safeArea}>
            <BackButton navigation={navigation} onLight />
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.topContainer}>
                    <LargeImage src={createAccount}/>
                    <Text style={styles.title}>Create your account</Text>
                </View>

                {/* Apple and Google sign-in mount here once Sign In with Apple is enabled on the App ID */}

                <View style={styles.container}>
                    <Pressable style={styles.buttoncontainer} onPress={() => navigation.navigate("SignupCredentials")}>
                        <Text style={styles.buttontext}>Sign up with email</Text>
                    </Pressable>
                    <Pressable style={styles.loginLink} onPress={() => navigation.navigate("Login1")} hitSlop={{ top: 12, bottom: 12 }}>
                        <Text style={styles.loginText}>Already have an account? Log in</Text>
                    </Pressable>
                    <PolicyLinks small color={scheme.muted} style={styles.policyLinks} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: scheme.bg,
    },
    scroll: {
        flex: 1,
        width: "100%",
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 16,
    },
    topContainer: {
        justifyContent: "flex-end",
        alignItems: "center",
        marginBottom: 20,
    },
    container: {
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        color: scheme.text,
        fontSize: 34,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 12,
        paddingHorizontal: 24,
    },
    buttoncontainer: {
        backgroundColor: scheme.cta,
        width: 280,
        height: 56,
        borderRadius: 28,
        justifyContent: "center",
        alignItems: "center",
    },
    buttontext: {
        color: scheme.ctaText,
        fontSize: 22,
        fontWeight: "bold",
    },
    loginLink: {
        marginTop: 16,
    },
    loginText: {
        color: scheme.text,
        fontSize: 14,
        textDecorationLine: "underline",
    },
    policyLinks: {
        marginTop: 24,
    },
});
