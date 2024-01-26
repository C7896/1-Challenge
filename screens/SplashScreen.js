import { View, Text, StyleSheet, SafeAreaView, Pressable, useWindowDimensions } from "react-native";
import React, { useState, useEffect } from "react";

import { initializeApp, getApps, getApp } from 'firebase/app';
import { onAuthStateChanged, initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseConfig } from "../firebase-config";

export default function SplashScreen({ navigation }) {

    const windowWidth = useWindowDimensions().width

    let app;
    let auth;

    if (!getApps().length) {
      try {
        app = initializeApp(firebaseConfig);
        auth = initializeAuth(app, {
          persistence: getReactNativePersistence(ReactNativeAsyncStorage),
        });
      } catch (error) {
        console.log("Error initializing app: ", error);
      }
    } else {
      app = getApp();
      auth = getAuth(app);
    }

    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        print(user)
        if (user) {
          // User is signed in.
          setIsAuthenticated(true);
        } else {
          // No user is signed in.
          setIsAuthenticated(false);
        }
        setLoading(false);
      });
      // Cleanup subscription on unmount
      return () => unsubscribe();
    }, []);

    if (!loading) {
      setTimeout(() => {
        navigation.navigate(isAuthenticated ? "Home Tabs" : "Login0");
      }, 1000);
    }

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