import { View, Text, StyleSheet, SafeAreaView, Pressable, useWindowDimensions } from "react-native";
import React, { useState, useEffect } from "react";

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from "../firebase-config";

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export default function SplashScreen({ navigation }) {

    const windowWidth = useWindowDimensions().width

    const app = initializeApp(firebaseConfig);
  
    const [isAuthenticated, setIsAuthenticated] = useState(false);
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        print(user)
        if (user) {
          // User is signed in.
          setIsAuthenticated(true);
        } else {
          // No user is signed in.
          setIsAuthenticated(false);
        }
      });
      // Cleanup subscription on unmount
      return () => unsubscribe();
    }, []);

    useEffect(() => {
        const delayNavigation = setTimeout(() => {
          // Navigate to the desired screen after 1 second
          navigation.navigate("Home Tabs"); // Replace 'YourScreen' with the actual screen name
        }, 1000);
    
        // Cleanup the timeout when the component unmounts
        return () => clearTimeout(delayNavigation);
      }, [navigation]);

    return (
        <SafeAreaView style={styles.container}>
            <Pressable>
                <View style={styles.container}>
                    <Text style={[styles.title, {fontSize: windowWidth > 500 ? 70 : 35}]}>1%</Text>
                    <Text style={[styles.title, {fontSize: windowWidth > 500 ? 70 : 35}]}>Challenge</Text>
                </View>
            </Pressable>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#A1D5AE",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        color: "white",
        fontWeight: "bold",
    },
});