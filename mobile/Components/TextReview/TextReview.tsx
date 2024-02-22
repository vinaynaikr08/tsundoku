import * as React from "react";
import { View, Text } from "react-native";
import Modal from "react-native-modal";

function TextReview({ isTextReviewModalVisible, setTextReviewModalVisible }) {
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
    </View>
  );
}

export default TextReview;
