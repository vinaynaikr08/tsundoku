import React from "react";
import { View, Text, StyleSheet, SafeAreaView, Image } from "react-native";
import styled from "styled-components/native";
import Dimensions from "../../Constants/Dimensions";
import Colors from "../../Constants/Colors";
import BookInfoTabs from "../BookInfoTabs";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Databases, Account } from "appwrite";
import { Query } from "appwrite";
import { client } from "@/appwrite";
import ID from "@/Constants/ID";
import Toast from "react-native-toast-message";
import { ActivityIndicator } from "react-native-paper";
import { BACKEND_API_BOOK_STATUS_URL } from "@/Constants/URLs";

const account = new Account(client);
const databases = new Databases(client);

enum BookState {
  WantToRead = "WANT_TO_READ",
  CurrentlyReading = "CURRENTLY_READING",
  Read = "READ",
  DidNotFinish = "DID_NOT_FINISH",
  None = "NONE",
}

const BOOK_STATE_MAPPING = {
  WANT_TO_READ: "Want to read",
  CURRENTLY_READING: "Currently reading",
  READ: "Read",
  DID_NOT_FINISH: "Did not finish",
};

function BookStateLookup(s: string): BookState | null {
  for (const key of Object.keys(BOOK_STATE_MAPPING)) {
    if (BOOK_STATE_MAPPING[key] === s) {
      return key as BookState;
    }
  }
  return null;
}

async function getBookStatus(book_id: string): Promise<BookState | null> {
  const user_id = (await account.get()).$id;
  let documents = (
    await databases.listDocuments(ID.mainDBID, ID.bookStatusCollectionID, [
      Query.equal("user_id", user_id),
      Query.equal("book", book_id),
    ])
  ).documents;

  if (documents.length > 0) {
    return documents[0].status;
  } else {
    return BookState.None;
  }
}

export const BookInfoModal = ({ route, navigation }) => {
  const { bookInfo } = route.params;
  const [status, setStatus] = React.useState<BookState | null>(null);

  React.useEffect(() => {
    (async () => {
      setStatus(await getBookStatus(bookInfo.id));
    })();
  }, []);

  const saveStatus = async (newStatus) => {
    if (!newStatus || newStatus === BookState.None) {
      return;
    }

    await fetch(`${BACKEND_API_BOOK_STATUS_URL}`, {
      method: "post",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: "Bearer " + (await account.createJWT()).jwt,
      }),
      body: JSON.stringify({
        book_id: bookInfo.id,
        status: newStatus,
      }),
    });

    Toast.show({
      type: "success",
      text1: "Status successfully saved!",
      position: "bottom",
      visibilityTime: 2000,
    });
  };

  const handlePress = () => {
    if (status === BookState.None) {
      navigation.navigate("review", { bookInfo: bookInfo });
      setStatus(BookState.Read);
      saveStatus(BookState.Read);
    }
  };

  const handleOptionSelect = (state: any) => {
    setStatus(BookStateLookup(state));
    saveStatus(BookStateLookup(state));
  };

  function StatusButtonView() {
    if (!status) {
      return <ActivityIndicator />;
    } else {
      if (status === BookState.None) {
        return (
          <ReadingStatusButton
            color={Colors.BUTTON_PURPLE}
            onPress={handlePress}
          >
            <ReadingNowContainer color={Colors.BUTTON_PURPLE}>
              <ButtonText color={"white"}>Mark as read</ButtonText>
            </ReadingNowContainer>
          </ReadingStatusButton>
        );
      } else {
        return (
          <DisabledReadingStatusButton color={Colors.BUTTON_GRAY}>
            <ReadingNowContainer color={Colors.BUTTON_GRAY}>
              <Text style={{ color: Colors.BUTTON_PURPLE, fontWeight: "600" }}>
                {BOOK_STATE_MAPPING[status]}
              </Text>
            </ReadingNowContainer>
          </DisabledReadingStatusButton>
        );
      }
    }
  }

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
        <View
          style={{
            flexDirection: "row",
            width: "37%",
            borderRadius: 13,
            backgroundColor:
              status === BookState.None
                ? Colors.BUTTON_PURPLE
                : Colors.BUTTON_GRAY,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 10,
            padding: 0,
          }}
        >
          {/* <StatusButtonView /> */}
          <SelectDropdown
            data={Object.values(BOOK_STATE_MAPPING)}
            onSelect={(state) => handleOptionSelect(state)}
            buttonTextAfterSelection={() => {
              return "";
            }}
            defaultButtonText={""}
            buttonStyle={{
              backgroundColor:
                status === BookState.None
                  ? Colors.BUTTON_PURPLE
                  : Colors.BUTTON_GRAY,
              paddingVertical: 5,
              borderRadius: 13,
              width: "28%",
              height: "100%",
            }}
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
                  color={
                    status === BookState.None
                      ? Colors.BUTTON_GRAY
                      : Colors.BUTTON_PURPLE
                  }
                  size={25}
                />
              );
            }}
            dropdownIconPosition={"left"}
          />
          <StatusButtonView />
        </View>
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

const DisabledReadingStatusButton = styled.View<ColorProps>`
  height: 45px;
  border: 2px solid ${({ color }) => color};
  padding: 1px 1px;
  background-color: ${Colors.BUTTON_GRAY};
  border-radius: 13px;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const ReadingNowContainer = styled.View<ColorProps>`
  flex-direction: row;
  align-items: center;
  background-color: ${({ color }) => color};
`;

const ButtonText = styled.Text<ColorProps>`
  color: ${({ color }) => color};
`;
