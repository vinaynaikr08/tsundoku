import { StyleSheet, Text, View, Pressable } from "react-native";
import Colors from "../../Constants/Colors";
import Dimensions from "../../Constants/Dimensions";

export const Carousel = () => {
  return (
    <View>
      <Text style={styles.title}>Carousel</Text>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.INITIAL_LAUNCH_SCREEN_BG_PINK,
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      fontSize: Dimensions.INITIAL_LAUNCH_SCREEN_TITLE,
      color: Colors.INITIAL_LAUNCH_SCREEN_TEXT_WHITE,
    },
    text: {
      margin: Dimensions.INITIAL_LAUNCH_SCREEN_TEXT_MARGIN,
      fontSize: Dimensions.INITIAL_LAUNCH_SCREEN_TEXT,
      color: Colors.INITIAL_LAUNCH_SCREEN_TEXT_WHITE,
    },
  });