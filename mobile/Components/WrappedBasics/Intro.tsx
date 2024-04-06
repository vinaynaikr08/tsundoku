import React from "react";
import { SafeAreaView, Text, } from "react-native"

export function intro(year: number) {
    return (
        <SafeAreaView style={{width: '50%', height: '100%', justifyContent: 'center'}}>
            <Text style={{fontSize: 25, textAlign: 'center'}}>Welcome to your {year} Tsundoku Wrapped!</Text>
        </SafeAreaView>
    );
} 