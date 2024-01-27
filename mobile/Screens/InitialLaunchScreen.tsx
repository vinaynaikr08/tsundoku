import React from "react";

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import Colors from '../Constants/Colors';
import { Icon } from '@rneui/themed';
import { white } from "material-ui/styles/colors";

export const InitialLaunchScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>tsundoku</Text>
            <Text style={styles.text}>1. The practice of buying books and not reading them, letting them pile up with other unread books</Text>

            <Pressable onPress={launchStart}>
                <Icon name={"arrow-forward"}  size={90} color="#ffffff"  />
            </Pressable>
            <StatusBar style="auto" />
        </View>
    );
}

function launchStart() {
    // TODO: Implement
    console.log("Open setup");
}

const styles = StyleSheet.create({
    // TODO: create a constants file to track margin, font size, color, etc.
    container: {
        flex: 1,
        backgroundColor: Colors.ONBOARDING_BG_PINK,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 40,
        color: '#ffffff',
    },
    text: {
        margin: 30,
        fontSize: 20,
        color: '#ffffff',
    }
});
