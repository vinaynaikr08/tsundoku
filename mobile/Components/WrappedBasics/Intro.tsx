import React from "react";
import { SafeAreaView, Text, } from "react-native"

export function intro() {
    return (
        <SafeAreaView style={{width: '50%', height: '100%', justifyContent: 'center'}}>
            <Text style={{fontSize: 25, textAlign: 'center'}}>Welcome to your {new Date().getFullYear()} Tsundoku Wrapped!</Text>
        </SafeAreaView>
    );
} 