import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import Dimensions from "../../Constants/Dimensions";
import Colors from "../../Constants/Colors";

interface BookInfoModalProps {
  isVisible: boolean;
  onClose: () => void;
  bookInfo: {
    coverImage: string;
    title: string;
    author: string;
    summary: string;
  };
}

const BookInfoModal: React.FC<BookInfoModalProps> = ({
  isVisible,
  onClose,
  bookInfo,
}) => {
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
              position: "absolute",
              backgroundColor: Colors.BOOK_INFO_MODAL_GREY_LINE_COLOR,
              height: 7,
              width: 70,
              borderRadius: 5,
              top: -265,
              //   marginTop: -250,
              //   marginTop: "-200%",
            }}
          />
        </View>
        {/* <Image
            source={{ uri: bookInfo.coverImage }}
            style={{
              width: Dimensions.BOOK_INFO_MODAL_COVER_WIDTH,
              height: Dimensions.BOOK_INFO_MODAL_COVER_HEIGHT,
              marginBottom: Dimensions.BOOK_INFO_MODAL_COVER_MARGIN_BOTTOM,
            }}
          /> */}
        <View
          style={{
            width: Dimensions.BOOK_INFO_MODAL_COVER_WIDTH,
            height: Dimensions.BOOK_INFO_MODAL_COVER_HEIGHT,
            marginTop: Dimensions.BOOK_INFO_MODAL_COVER_MARGIN_TOP,
            backgroundColor: Colors.BUTTON_PURPLE,
            borderRadius: Dimensions.BOOK_INFO_MODAL_COVER_RADIUS,
            marginBottom: Dimensions.BOOK_INFO_MODAL_COVER_MARGIN_BOTTOM,
          }}
        />
        <Text
          style={{
            fontSize: Dimensions.BOOK_INFO_MODAL_TITLE_FONT_SIZE,
            fontWeight: "bold",
            marginBottom: 6,
          }}
        >
          {bookInfo.title}
        </Text>
        <Text
          style={{
            fontSize: Dimensions.BOOK_INFO_MODAL_AUTHOR_FONT_SIZE,
            marginBottom: 10,
          }}
        >
          {bookInfo.author}
        </Text>
        <TouchableOpacity
          onPress={onClose}
          style={{
            backgroundColor: Colors.BUTTON_PURPLE,
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 5,
            marginBottom: 10,
          }}
        >
          <Text style={{ color: "white" }}>Mark book as read</Text>
        </TouchableOpacity>
        <Text style={{ margin: Dimensions.BOOK_INFO_MODAL_SUMMARY_MARGIN }}>
          {bookInfo.summary}
        </Text>
      </View>
    </Modal>
  );
};

export default BookInfoModal;
