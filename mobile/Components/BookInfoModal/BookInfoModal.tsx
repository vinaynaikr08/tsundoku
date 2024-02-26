import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Modal,
} from "react-native";
import styled from "styled-components/native";
import Dimensions from "../../Constants/Dimensions";
import Colors from "../../Constants/Colors";
import BookInfoTabs from "../BookInfoTabs";
import SelectDropdown from "react-native-select-dropdown";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { BookInfoContext } from "../../Contexts";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useRoute } from "@react-navigation/native";

export const BookInfoModal = ({ route, navigation }) => {
  const { bookInfo } = route.params;
  const [markedRead, setMarkedRead] = useState("Mark book as read");
  const [selectedOption, setSelectedOption] = useState(markedRead);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownOptions = [
    markedRead,
    "Currently reading",
    "Want to read",
    "Did not finish",
  ];
  const handlePress = () => {
    selectedOption === "Mark book as read"
      ? navigation.navigate("review", { bookInfo: bookInfo })
      : null;
    setSelectedOption("Read");
    setMarkedRead("Read");
  };

  const handleOptionSelect = (option: any) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
  };

  return (
    <View style={styles.outsideModalContainer}>
      <View style={styles.modalStyle}>
        <View style={{ alignItems: "center" }}>
          <View style={styles.modalGreyLine} />
        </View>
        <Image
          style={styles.bookCoverStyle}
          resizeMode="contain"
          source={{ uri: bookInfo.image_url }}
        />
        <Text style={styles.bookTitleText}>{bookInfo.title}</Text>
        <Text style={styles.bookAuthorText}>{bookInfo.author}</Text>
        <ButtonContainer padding={0}>
          <SelectDropdown
            data={dropdownOptions}
            onSelect={(selectedItem, index) =>
              handleOptionSelect(dropdownOptions[index])
            }
            buttonTextAfterSelection={(selectedItem: string) => {
              return "";
            }}
            defaultButtonText={""}
            buttonStyle={styles.markAsReadButton}
            dropdownStyle={styles.dropdownStyle}
            dropdownOverlayColor={"transparent"}
            rowTextStyle={{ fontSize: 14 }}
            renderDropdownIcon={(isOpened) => {
              return (
                <Icon
                  name={
                    isOpened
                      ? "chevron-up-circle-outline"
                      : "chevron-down-circle-outline"
                  }
                  color={"white"}
                  size={25}
                />
              );
            }}
            dropdownIconPosition={"left"}
          />
          <ReadingStatusButton
            color={Colors.BUTTON_PURPLE}
            onPress={handlePress}
          >
            <ReadingNowContainer>
              <ButtonText color={"white"}>{selectedOption}</ButtonText>
            </ReadingNowContainer>
          </ReadingStatusButton>
        </ButtonContainer>
        <SafeAreaView>
          <BookInfoTabs bookInfo={bookInfo} />
        </SafeAreaView>
      </View>
    </View>
  );
};

export default BookInfoModal;

const styles = StyleSheet.create({
  markAsReadButton: {
    backgroundColor: Colors.BUTTON_PURPLE,
    paddingVertical: 5,
    borderRadius: 13,
    width: "25%",
    height: "100%",
  },
  readButtonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 13,
  },
  outsideModalContainer: {
    flex: 1,
  },
  dropdownStyle: {
    width: "40%",
    backgroundColor: "#d6d6d6",
    borderRadius: 10,
  },
  modalStyle: {
    flex: 1,
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
  buttonGroupContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  dropdownButtonGroup: {
    flex: 1,
    justifyContent: "flex-end",
  },
});

export interface ColorProps {
  color: string;
}

const ButtonContainer = styled.View<{ padding: number }>`
  flex-direction: row;
  width: 37%;
  border-radius: 13px;
  background-color: ${Colors.BUTTON_PURPLE};
  align-items: center;
  margin-bottom: 10px;
  padding: ${({ padding }) => `0 ${padding}px`};
`;

const ReadingStatusButton = styled.TouchableOpacity<ColorProps>`
  height: 45px;
  border: 2px solid ${({ color }) => color};
  padding: 1px 1px;
  background-color: ${Colors.BUTTON_PURPLE};
  border-radius: 13px;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const ReadingNowContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${Colors.BUTTON_PURPLE};
`;

const ButtonText = styled.Text<ColorProps>`
  color: ${({ color }) => color};
`;
