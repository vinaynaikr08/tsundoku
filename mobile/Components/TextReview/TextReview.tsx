import * as React from "react";
import { View, Text, Pressable } from "react-native";
import Modal from "react-native-modal";
import Colors from "../../Constants/Colors";

function TextReview(props) {
  const { navigation } = props;
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        width: "100%",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      }}
    >
      <Text>Text Review</Text>
      <Pressable
        onPress={() => navigation.pop()}
        style={{ backgroundColor: Colors.BUTTON_GRAY, padding: 10 }}
      >
        <Text>Go back</Text>
      </Pressable>
    </View>
  );
}

export default TextReview;
