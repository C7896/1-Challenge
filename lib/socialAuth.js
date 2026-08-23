import { Platform } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
    GoogleAuthProvider,
    OAuthProvider,
    signInWithCredential,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "../firebase";
import { GOOGLE_IOS_CLIENT_ID } from "../constants/googleAuth";

// Configure once at module load. The iOS client id comes from the same
// GoogleService-Info.plist the native SDK reads, so the two can never disagree.
GoogleSignin.configure({
    iosClientId: GOOGLE_IOS_CLIENT_ID,
});

export async function isAppleAvailable() {
    if (Platform.OS !== "ios") {
        return false;
    }
    try {
        return await AppleAuthentication.isAvailableAsync();
    } catch {
        return false;
    }
}

// A social sign-in tells us who someone is, not whether they have finished
// setting up. Both providers funnel through here so the "does this account have
// a profile yet" rule lives in exactly one place.
async function finish(credential) {
    const result = await signInWithCredential(auth, credential);
    const user = result.user;

    let hasProfile = false;
    try {
        const snap = await getDoc(doc(db, "users", user.uid));
        hasProfile = snap.exists() && !!snap.data()?.username;
    } catch (error) {
        // If the read fails we cannot tell, and sending someone to Home without a
        // profile leaves every later counter write failing. Treat it as new and
        // let them confirm their details; writing the doc again is harmless.
        console.error("Could not read profile after social sign in: ", error);
        hasProfile = false;
    }

    return {
        user,
        needsProfile: !hasProfile,
        suggestedName: user.displayName ?? "",
    };
}

export async function signInWithApple() {
    const appleCredential = await AppleAuthentication.signInAsync({
        requestedScopes: [
            AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
            AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
    });

    if (!appleCredential.identityToken) {
        throw new Error("no-identity-token");
    }

    const provider = new OAuthProvider("apple.com");
    const credential = provider.credential({
        idToken: appleCredential.identityToken,
    });

    const outcome = await finish(credential);

    // Apple only ever sends the name on the very first authorisation, so if it
    // is there, keep it for the profile step. It is gone on every later sign in.
    const given = appleCredential.fullName?.givenName ?? "";
    const family = appleCredential.fullName?.familyName ?? "";
    const appleName = `${given} ${family}`.trim();

    return { ...outcome, suggestedName: appleName || outcome.suggestedName };
}

export async function signInWithGoogle() {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: false }).catch(() => {});
    const response = await GoogleSignin.signIn();

    // v13+ returns { type, data }; older returns the user object directly
    const idToken = response?.data?.idToken ?? response?.idToken;
    if (!idToken) {
        throw new Error("cancelled");
    }

    const credential = GoogleAuthProvider.credential(idToken);
    return finish(credential);
}

// Maps provider and Firebase errors onto something worth showing a person.
// Returns null when the user simply backed out, which needs no alert at all.
export function friendlySocialError(error) {
    const code = error?.code ?? "";
    const message = String(error?.message ?? "");

    if (
        code === "ERR_REQUEST_CANCELED" ||
        code === "ERR_CANCELED" ||
        code === "SIGN_IN_CANCELLED" ||
        code === "-5" ||
        message.includes("cancelled") ||
        message.includes("canceled")
    ) {
        return null;
    }

    if (code === "auth/account-exists-with-different-credential") {
        return {
            title: "That email is already in use",
            body: "You already have an account with that address. Sign in with the method you used first.",
        };
    }
    if (code === "auth/network-request-failed") {
        return { title: "No connection", body: "Check your internet connection and try again." };
    }
    if (message.includes("no-identity-token")) {
        return { title: "Could not sign you in", body: "Apple did not return a sign in token. Please try again." };
    }

    return { title: "Could not sign you in", body: "Something went wrong. Please try again." };
}
