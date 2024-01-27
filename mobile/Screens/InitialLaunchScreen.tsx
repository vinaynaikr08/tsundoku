import React from "react";

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import Colors from '../Constants/Colors';
import { Icon } from '@rneui/themed';

export const InitialLaunchScreen = () => {
    return (
        <View style={styles.container}>
            <Text>tsundoku</Text>
            <Text>1. The practice of buying books and not reading them, letting them pile up with other unread books</Text>

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
    container: {
        flex: 1,
        backgroundColor: Colors.ONBOARDING_BG_PINK,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
