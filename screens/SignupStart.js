import { View, Text, Pressable, SafeAreaView, StyleSheet } from "react-native";
import LargeImage from "../components/largeImage";
import PolicyLinks from "../components/policyLinks";
import SocialSignInButtons from "../components/socialSignInButtons";
import { AUTH_SCHEMES } from "../constants/theme";

const createAccount = require("../assets/auth-create-account.png");

const scheme = AUTH_SCHEMES.green;

export default function SignupStart( {navigation} ) {
    return(
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.page}>
                <View style={styles.topContainer}>
                    <LargeImage src={createAccount}/>
                    <Text style={styles.title}>Create your account</Text>
                </View>

                <View style={styles.actions}>
                    <SocialSignInButtons
                        muted={scheme.muted}
                        googleLabel="Sign up with Google"
                        onSignedIn={({ needsProfile, suggestedName }) => {
                            // a brand new social account still has no username, so it
                            // finishes at the same profile step the email path uses
                            if (needsProfile) {
                                navigation.navigate("SignupProfile", { social: true, suggestedName });
                            } else {
                                navigation.reset({ index: 0, routes: [{ name: "Home" }] });
                            }
                        }}
                    />

                    <Pressable style={styles.buttoncontainer} onPress={() => navigation.navigate("SignupCredentials")}>
                        <Text style={styles.buttontext}>Sign up with email</Text>
                    </Pressable>
                </View>

                <View style={styles.footer}>
                    <Pressable style={styles.loginLink} onPress={() => navigation.navigate("Login1")} hitSlop={{ top: 12, bottom: 12 }}>
                        <Text style={styles.loginText}>Already have an account? Log in</Text>
                    </Pressable>
                    <PolicyLinks small color={scheme.muted} style={styles.policyLinks} />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: scheme.bg,
    },
    page: {
        flex: 1,
        alignItems: "center",
        paddingTop: 48,
    },
    topContainer: {
        justifyContent: "flex-end",
        alignItems: "center",
        marginBottom: 20,
    },
    actions: {
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "stretch",
        // the social buttons sit above, so the email button now starts lower down
        marginTop: 36,
    },
    footer: {
        // pinned near the bottom edge rather than floating under the buttons
        marginTop: "auto",
        alignItems: "center",
        paddingBottom: 12,
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
        color: "#FFFFFF",
        fontSize: 22,
        fontWeight: "bold",
    },
    loginLink: {
        marginTop: 24,
    },
    loginText: {
        color: scheme.text,
        fontSize: 14,
        textDecorationLine: "underline",
    },
    policyLinks: {
        // sits close under the log in link, as asked
        marginTop: 15,
    },
});
