import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import Modal from "react-native-modal";
import Dimensions from "../../Constants/Dimensions";
import Colors from "../../Constants/Colors";
import BookInfoTabs from "../BookInfoTabs";
import SelectDropdown from "react-native-select-dropdown";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { BookInfoContext } from "../../Contexts";
import { useRoute } from "@react-navigation/native"


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

const bookInfo = {
  coverImage: "",
  title: "The Poppy War",
  author: "RF Kuang",
  summary:
    "The Poppy War is a 2018 novel by R. F. Kuang, published by Harper Voyager. The Poppy War, a grimdark fantasy, draws its plot and politics from mid-20th-century China, with the conflict in the novel based on the Second Sino-Japanese War, and an atmosphere inspired by the Song dynasty.",
};

const BookInfoModal: React.FC<BookInfoModalProps> = ({
  isVisible,
  onClose,
}) => {
  const route = useRoute()
  //const {bookInfo} = route.params?.bookInfo;
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
    <View style={styles.outsideModalContainer}>
        {/* <ScrollView contentContainerStyle={styles.modalScrollContainer}> */}
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
            dropdownStyle={{ backgroundColor: "grey" }}
            dropdownOverlayColor={"transparent"}
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
        {/* </ScrollView> */}
    </View>
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
  modalScrollContainer: {
    // flex: 1,
  },
  outsideModalContainer: {
    flex: 1,
  },
  modalStyle: {
    flex: 1,
    // maxHeight: Dimensions.get('window').height - 50,
    // justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    width: "110%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginLeft: Dimensions.BOOK_INFO_MODAL_MARGIN_LEFT,
    marginRight: Dimensions.BOOK_INFO_MODAL_MARGIN_RIGHT,
  },
  modalGreyLine: {
    position: "relative",
    backgroundColor: Colors.BOOK_INFO_MODAL_GREY_LINE_COLOR,
    height: 7,
    width: 70,
    borderRadius: 5,
    marginTop: "3%",
    // marginTop: Dimensions.BOOK_INFO_MODAL_GREY_LINE_MARGIN_TOP,
    // top: -265,
    //   marginTop: -250,
    //   marginTop: "-200%",
  },
  bookCoverStyle: {
    position: "relative",
    width: Dimensions.BOOK_INFO_MODAL_COVER_WIDTH,
    height: Dimensions.BOOK_INFO_MODAL_COVER_HEIGHT,
    marginTop: "5%",
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
