import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import {signOut, getAuth} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from "../firebase-config";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const SignOutButton = () => {
    const handleSignOut = () => {
        signOut(auth).then(() => {
            
          }).catch((error) => {

          });
    };

    return (
        <TouchableOpacity style={styles.button} onPress={handleSignOut}>
            <Text style={styles.text}>Sign Out</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#f44336', // Red color
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    text: {
        color: 'white',
        fontSize: 16,
    }
});

export default SignOutButton;
