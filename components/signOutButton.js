import React from 'react';
import { TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';

import { signOut } from 'firebase/auth';
import { auth } from "../firebase";

const signOutIcon = require("../assets/signOut.png");

export default function SignOutButton({ navigation }) {

    const handleSignOut = () => {
        signOut(auth).then(() => {
            navigation.reset({ index: 0, routes: [{ name: "Splash" }] });
          }).catch((error) => {
              Alert.alert("Could not sign out", "Please try again.");
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
