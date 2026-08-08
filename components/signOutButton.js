import React from 'react';
import { TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';

import { initializeApp } from 'firebase/app';
import { signOut, getAuth } from 'firebase/auth';
import { firebaseConfig } from "../firebase-config";

const signOutIcon = require("../assets/signOut.png");

export default function SignOutButton({ navigation }) {

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    const handleSignOut = () => {
        signOut(auth).then(() => {
            navigation.navigate("Splash");
          }).catch((error) => {
              Alert.alert("Could not sign out: ", error);
              console.log("Error signing out: ", error);
          });
    };

    return (
        <TouchableOpacity style={styles.button} onPress={handleSignOut}>
            <Image source={signOutIcon} style={styles.icon} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        position: "absolute",
        top: 60,
        right: 15,
    },
    icon: {
        width: 30,
        height: 30,
    }
});
