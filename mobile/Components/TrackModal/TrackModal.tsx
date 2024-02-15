import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import Dimensions from "../../Constants/Dimensions";
import Colors from "../../Constants/Colors";

interface TrackModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const TrackModal: React.FC<TrackModalProps> = ({ isVisible, onClose }) => {
  return (
    <Modal
      isVisible={isVisible}
      onSwipeComplete={onClose}
      swipeDirection={["down"]}
      style={{ marginBottom: 0 }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
          width: "110%",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          marginTop: "30%",
          marginLeft: Dimensions.BOOK_INFO_MODAL_MARGIN_LEFT,
          marginRight: Dimensions.BOOK_INFO_MODAL_MARGIN_RIGHT,
        }}
      >
        <View style={{ alignItems: "center" }}>
          <View
            style={{
              backgroundColor: Colors.BOOK_INFO_MODAL_GREY_LINE_COLOR,
              height: 7,
              width: 70,
              borderRadius: 5,
              marginTop: "-86%",
            }}
          />
        </View>
        <Text>Text</Text>
        <TouchableOpacity onPress={onClose}>
          <Text>Here</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default TrackModal;
