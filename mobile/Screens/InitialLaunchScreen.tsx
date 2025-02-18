import React from "react";

import { AppNavigationStackParamList } from "@/navigation/AppNavigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Icon } from "@rneui/themed";
import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Colors from "../Constants/Colors";
import Dimensions from "../Constants/Dimensions";

type Props = NativeStackScreenProps<
  AppNavigationStackParamList,
  "initial_launch"
>;

function InitialLaunchScreen({ navigation }: Props) {
  function launchStart() {
    navigation.navigate("sign_in");
  }

  return (
    <View style={styles.container} testID="initial-launch-screen-view">
      <Text style={styles.title}>tsun•do•ku</Text>
      <Text style={styles.text}>/ˈsʌn.doʊ.kuː/ noun</Text>
      <Text style={styles.text}>
        1. The practice of buying books and not reading them, letting them pile
        up with other unread books
      </Text>

      <Pressable
        onPress={launchStart}
        testID="initial-launch-screen-launch-start-arrow"
      >
        <Icon
          style={styles.icon}
          name={"arrow-forward"}
          size={Dimensions.INITIAL_LAUNCH_SCREEN_NEXT_ARROW_SIZE}
          color={Colors.INITIAL_LAUNCH_SCREEN_ARROW_WHITE}
        />
      </Pressable>
      <StatusBar style="auto" />
    </View>
  );
}

export default InitialLaunchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.INITIAL_LAUNCH_SCREEN_BG_PINK,
    justifyContent: "center",
    marginBottom: Dimensions.INITIAL_LAUNCH_SCREEN_BOTTOM_MARGIN,
  },
  title: {
    marginTop: Dimensions.INITIAL_LAUNCH_SCREEN_TITLE_TOP_MARGIN,
    textAlign: "center",
    fontSize: Dimensions.INITIAL_LAUNCH_SCREEN_TITLE,
    color: Colors.INITIAL_LAUNCH_SCREEN_TEXT_WHITE,
  },
  text: {
    margin: Dimensions.INITIAL_LAUNCH_SCREEN_TEXT_MARGIN,
    fontSize: Dimensions.INITIAL_LAUNCH_SCREEN_TEXT,
    color: Colors.INITIAL_LAUNCH_SCREEN_TEXT_WHITE,
    textAlign: "left",
    marginLeft: Dimensions.INITIAL_LAUNCH_SCREEN_TEXT_SIDE_MARGIN,
    marginRight: Dimensions.INITIAL_LAUNCH_SCREEN_TEXT_SIDE_MARGIN,
  },
  icon: {
    marginTop: Dimensions.INITIAL_LAUNCH_SCREEN_NEXT_ARROW_TOP_MARGIN,
  },
});
