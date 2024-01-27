import React from "react";

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import Colors from '../Constants/Colors';
import { Icon } from '@rneui/themed';
import Dimensions from "../Constants/Dimensions";

export const InitialLaunchScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>tsundoku</Text>
            <Text style={styles.text}>1. The practice of buying books and not reading them, letting them pile up with other unread books</Text>

            <Pressable onPress={launchStart}>
                <Icon name={"arrow-forward"} size={Dimensions.INITIAL_LAUNCH_SCREEN_NEXT_ARROW_SIZE} color={Colors.INITIAL_LAUNCH_SCREEN_ARROW_WHITE} />
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
        backgroundColor: Colors.INITIAL_LAUNCH_SCREEN_BG_PINK,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: Dimensions.INITIAL_LAUNCH_SCREEN_TITLE,
        color: Colors.INITIAL_LAUNCH_SCREEN_TEXT_WHITE,
    },
    text: {
        margin: Dimensions.INITIAL_LAUNCH_SCREEN_TEXT_MARGIN,
        fontSize: Dimensions.INITIAL_LAUNCH_SCREEN_TEXT,
        color: Colors.INITIAL_LAUNCH_SCREEN_TEXT_WHITE,
    }
});
