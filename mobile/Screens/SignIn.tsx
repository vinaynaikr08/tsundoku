import React from "react";

import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Pressable } from "react-native";
import Colors from "../Constants/Colors";
import { Icon } from "@rneui/themed";
import Dimensions from "../Constants/Dimensions";

export const SignIn = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in</Text>
      <Text style={styles.text}>
        email
      </Text>
      <Text style={styles.text}>
        password
      </Text>
      <Pressable onPress={launchStart}>
        <Icon style={styles.icon}
          name={"arrow-forward"}
          size={Dimensions.INITIAL_LAUNCH_SCREEN_NEXT_ARROW_SIZE}
          color={Colors.INITIAL_LAUNCH_SCREEN_ARROW_WHITE}
        />
      </Pressable>
      <StatusBar style="auto" />
    </View>
  );
};

function launchStart() {
  // TODO: Implement
  console.log("Open setup");
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.INITIAL_LAUNCH_SCREEN_BG_PINK,
    // alignItems: "center",
    justifyContent: "center",
    marginBottom: -100,
  },
  title: {
    marginTop: 350,
    textAlign: 'left',
    marginLeft: Dimensions.INITIAL_LAUNCH_SCREEN_TEXT_SIDE_MARGIN,
    fontSize: Dimensions.INITIAL_LAUNCH_SCREEN_TITLE,
    color: Colors.SIGN_IN_TEXT_BLACK,
  },
  text: {
    margin: Dimensions.INITIAL_LAUNCH_SCREEN_TEXT_MARGIN,
    fontSize: Dimensions.INITIAL_LAUNCH_SCREEN_TEXT,
    color: Colors.INITIAL_LAUNCH_SCREEN_TEXT_WHITE,
    textAlign: 'left',
    marginLeft: Dimensions.INITIAL_LAUNCH_SCREEN_TEXT_SIDE_MARGIN,
    marginRight: Dimensions.INITIAL_LAUNCH_SCREEN_TEXT_SIDE_MARGIN,
  },
  icon: {
    // marginBottom: -40,
    marginTop: 40,
  }
});
