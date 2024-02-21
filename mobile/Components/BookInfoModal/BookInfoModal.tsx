import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import Modal from "react-native-modal";
import Dimensions from "../../Constants/Dimensions";
import Colors from "../../Constants/Colors";
import BookInfoTabs from "../BookInfoTabs";
import SelectDropdown from "react-native-select-dropdown";
import FontAwesome from "react-native-vector-icons/FontAwesome";

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
  const [selectedOption, setSelectedOption] = useState("Mark book as read");

  const dropdownOptions = [
    "Mark as read",
    "Read",
    "Currently reading",
    "Want to read",
    "Did not finish",
  ];

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  return (
    <Modal
      isVisible={isVisible}
      onSwipeComplete={onClose}
      swipeDirection={["down"]}
      style={{ marginBottom: 0 }}
    >
      <View style={styles.modalStyle}>
        <View style={{ alignItems: "center" }}>
          <View style={styles.modalGreyLine} />
        </View>
        {/* <Image
            source={{ uri: bookInfo.coverImage }}
            style={{
              width: Dimensions.BOOK_INFO_MODAL_COVER_WIDTH,
              height: Dimensions.BOOK_INFO_MODAL_COVER_HEIGHT,
              marginBottom: Dimensions.BOOK_INFO_MODAL_COVER_MARGIN_BOTTOM,
            }}
          /> */}
        <View style={styles.bookCoverStyle} />
        <Text style={styles.bookTitleText}>{bookInfo.title}</Text>
        <Text style={styles.bookAuthorText}>{bookInfo.author}</Text>
        <SelectDropdown
          data={dropdownOptions}
          onSelect={(selectedItem, index) =>
            handleOptionSelect(dropdownOptions[index])
          }
          buttonTextAfterSelection={(selectedItem: string) => {
            return selectedItem;
          }}
          defaultButtonText={selectedOption}
          buttonStyle={styles.markAsReadButton}
          buttonTextStyle={styles.readButtonText}
          dropdownStyle={{ backgroundColor: "white" }}
          rowTextStyle={{ fontSize: 14 }}
          renderDropdownIcon={(isOpened) => {
            return (
              <FontAwesome
                name={isOpened ? "chevron-up" : "chevron-down"}
                color={"white"}
                size={15}
              />
            );
          }}
          dropdownIconPosition={"right"}
        />
        <SafeAreaView>
          <BookInfoTabs bookInfo={bookInfo} />
        </SafeAreaView>
        {/* <Text style={{ margin: Dimensions.BOOK_INFO_MODAL_SUMMARY_MARGIN }}>
          {bookInfo.summary}
        </Text> */}
      </View>
    </Modal>
  );
};

export default BookInfoModal;

const styles = StyleSheet.create({
  markAsReadButton: {
    backgroundColor: Colors.BUTTON_PURPLE,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 13,
    width: "38%",
    height: "5%",
    marginBottom: 10,
  },
  readButtonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 13,
  },
  modalStyle: {
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
  },
  modalGreyLine: {
    position: "absolute",
    backgroundColor: Colors.BOOK_INFO_MODAL_GREY_LINE_COLOR,
    height: 7,
    width: 70,
    borderRadius: 5,
    marginTop: Dimensions.BOOK_INFO_MODAL_GREY_LINE_MARGIN_TOP,
    // top: -265,
    //   marginTop: -250,
    //   marginTop: "-200%",
  },
  bookCoverStyle: {
    width: Dimensions.BOOK_INFO_MODAL_COVER_WIDTH,
    height: Dimensions.BOOK_INFO_MODAL_COVER_HEIGHT,
    marginTop: Dimensions.BOOK_INFO_MODAL_COVER_MARGIN_TOP,
    backgroundColor: Colors.BUTTON_PURPLE,
    borderRadius: Dimensions.BOOK_INFO_MODAL_COVER_RADIUS,
    marginBottom: Dimensions.BOOK_INFO_MODAL_COVER_MARGIN_BOTTOM,
  },
  bookTitleText: {
    fontSize: Dimensions.BOOK_INFO_MODAL_TITLE_FONT_SIZE,
    fontWeight: "bold",
    marginBottom: Dimensions.BOOK_INFO_MODAL_TITLE_MARGIN_BOT,
  },
  bookAuthorText: {
    fontSize: Dimensions.BOOK_INFO_MODAL_AUTHOR_FONT_SIZE,
    marginBottom: 10,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
});
