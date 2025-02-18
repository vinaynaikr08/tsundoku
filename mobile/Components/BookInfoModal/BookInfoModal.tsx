import Backend from "@/Backend";
import ID from "@/Constants/ID";
import { BACKEND_API_BOOK_STATUS_URL } from "@/Constants/URLs";
import { BookInfoWrapperContext } from "@/Contexts";
import { client } from "@/appwrite";
import { Account, Databases, Query, ID as UID } from "appwrite";
import React from "react";
import { Image, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import styled from "styled-components/native";
import Colors from "../../Constants/Colors";
import Dimensions from "../../Constants/Dimensions";
import BookInfoTabs from "../BookInfoTabs";

const account = new Account(client);
const databases = new Databases(client);
const backend = new Backend();

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
  const documents = (
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

async function sendNotificationToFriends(state, title: string) {
  let friends = [];

  const account_ret = await account.get();
  const user_id = account_ret.$id;
  const name = account_ret.name;

  const friend_docs = (
    await databases.listDocuments(ID.mainDBID, ID.friendsCollectionID, [
      Query.or([
        Query.equal("requester", user_id),
        Query.equal("requestee", user_id),
      ]),
    ])
  ).documents;

  const filtered = friend_docs.filter((doc) => doc.status == "ACCEPTED");
  friends = filtered.map((friend) =>
    user_id == friend.requestee
      ? { id: friend.requester, notif: friend.requester_notifs }
      : { id: friend.requestee, notif: friend.requestee_notifs },
  );

  try {
    for (const friend of friends) {
      let general = true;
      let statuses = true;

      // Get notification settings
      try {
        const notification_docs = (
          await databases.listDocuments(
            ID.mainDBID,
            ID.notificationsCollectionID,
            [Query.equal("user_id", friend.id)],
          )
        ).documents;

        if (notification_docs.length == 0) {
          await databases.createDocument(
            ID.mainDBID,
            ID.notificationsCollectionID,
            UID.unique(),
            {
              user_id: friend.id,
              general: true,
              new_follower: true,
              friend_reading_status_update: true,
            },
          );
          general = true;
          statuses = true;
        } else {
          general = notification_docs[0].general;
          statuses = notification_docs[0].friend_reading_status_update;
        }
        if (general && statuses && friend.notif) {
          await backend.sendNotification(
            friend.id,
            "status_update",
            name + " has updated " + title + "!",
            name + " has set the status of " + title + " to " + state,
          );
        }
      } catch (error) {
        console.error(error);
      }
    }
  } catch (error) {
    console.error(error);
  }
}

export const BookInfoModal = ({ route, navigation }) => {
  const bookInfo = React.useContext(BookInfoWrapperContext);
  const [status, setStatus] = React.useState<BookState | null>(null);

  React.useEffect(() => {
    const fetchInitialBookStatus = async () => {
      if (bookInfo) {
        setStatus(await getBookStatus(bookInfo.id));
      }
    };

    fetchInitialBookStatus().catch(console.error);
  }, []);

  const saveStatus = async (newStatus) => {
    if (!newStatus || newStatus === BookState.None) {
      return;
    }
    if (newStatus === BookState.Read) {
      // Only God knows why we need to wait an arbitrary 500 ms in order for the review modal to open
      // every single time we invoke the navigate function. It's probably because the dropdown library
      // we use messes with the state of the react-navigation library, which makes it cancel the navigate
      // call until we exit out of the current modal. 500 ms is a perfectly acceptable compromise in order
      // for us to not wear straitjackets debugging God knows what's going on in the library calls of the
      // horror that is React Native.
      setTimeout(() => {
        navigation.navigate("review", { bookInfo: bookInfo });
      }, 500);
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
  };

  const handlePress = async () => {
    if (status === BookState.None) {
      //navigation.navigate("review", { bookInfo: bookInfo });
      setStatus(BookState.Read);
      await saveStatus(BookState.Read);
    }
  };

  const handleOptionSelect = (state: any, title: any) => {
    setStatus(BookStateLookup(state));
    (async () => {
      await saveStatus(BookStateLookup(state));
    })();
    sendNotificationToFriends(state, title);
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
          <SelectDropdown
            data={Object.values(BOOK_STATE_MAPPING)}
            onSelect={(state) => handleOptionSelect(state, bookInfo.title)}
            renderButton={(selectedItem, isOpen) => {
              return (
                <View
                  style={{
                    backgroundColor:
                      status === BookState.None
                        ? Colors.BUTTON_PURPLE
                        : Colors.BUTTON_GRAY,
                    paddingBottom: 11,
                    borderRadius: 13,
                    width: "28%",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <Text style={{ fontSize: 14, color: "black" }}>
                    {selectedItem?.title || ""}
                  </Text>
                  <Icon
                    name={
                      isOpen
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
                </View>
              );
            }}
            renderItem={(item, _index, isSelected) => {
              return (
                <View
                  style={{
                    ...styles.dropdownItemStyle,
                    ...(isSelected && { backgroundColor: "grey" }),
                  }}
                >
                  <Text style={styles.dropdownButtonTxtStyle}>{item}</Text>
                </View>
              );
            }}
            dropdownStyle={styles.dropdownStyle}
            dropdownOverlayColor={"transparent"}
          />
          <StatusButtonView />
        </View>
        <SafeAreaView>
          <BookInfoTabs bookInfo={bookInfo} navigation={navigation} />
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
  dropdownItemStyle: {
    backgroundColor: "#d6d6d6",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "grey",
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "400",
    color: "black",
    textAlign: "center",
  },
  modalStyle: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
    width: "110%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // paddingHorizontal: 50,
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
    maxWidth: "90%",
    textAlign: "center",
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
