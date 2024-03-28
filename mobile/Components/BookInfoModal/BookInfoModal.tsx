import React, { useContext, useEffect, useRef } from "react";
import { View, Text, StyleSheet, SafeAreaView, Image } from "react-native";
import styled from "styled-components/native";
import Dimensions from "../../Constants/Dimensions";
import Colors from "../../Constants/Colors";
import BookInfoTabs from "../BookInfoTabs";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Databases, Account } from "appwrite";
import { Query, Permission, Role } from "appwrite";
import { client } from "@/appwrite";
import ID from "@/Constants/ID";
import Toast from "react-native-toast-message";
import { ActivityIndicator } from "react-native-paper";
import { BACKEND_API_BOOK_STATUS_URL } from "@/Constants/URLs";
import { BookInfoWrapperContext } from "@/Contexts";
import Backend from "@/Backend";
import { BACKEND_API_URL } from "@/Constants/URLs";
import { ID as UID }  from  "appwrite" ;


const account = new Account(client);
const databases = new Databases(client);
const backend = new Backend();

function userPermissions(user_id: string) {
  return [
    Permission.read(Role.user(user_id)),
    Permission.update(Role.user(user_id)),
    Permission.delete(Role.user(user_id)),
  ];
}

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

async function sendNotificationToFriends(state, title) {
  let friends = [];
  let name = "";
  account
    .get()
    .then((response) => {
      const user_id = response.$id;
      name = response.name;
      const databases = new Databases(client);
      const promise = databases.listDocuments(
        ID.mainDBID,
        ID.friendsCollectionID,
        [
          Query.or([
            Query.equal("requester", user_id),
            Query.equal("requestee", user_id),
          ]),
        ],
      );
      promise.then(function (response) {
        const documents = response.documents;
        const filtered = documents.filter((doc) => doc.status == "ACCEPTED");
        friends = filtered.map((friend) => (user_id == friend.requestee) ? friend.requester : friend.requestee);
      })
      .then(async () => {
        try {
          for (const friendId of friends) {
              let general = true;
              let statuses = true;
              // get notification settings
              try {
                  const promise = databases.listDocuments(
                      ID.mainDBID,
                      ID.notificationsCollectionID,
                      [Query.equal("user_id", friendId),],
                  );

                  promise.then(function (response) {
                      const documents = response.documents;
                      if (documents.length == 0) {
                        const promise1 = databases.createDocument(
                          ID.mainDBID,
                          ID.notificationsCollectionID,
                          UID.unique(),
                          {
                            user_id: friendId,
                            general: true,
                            new_follower: true,
                            friend_reading_status_update: true,
                          },
                        );
                      } else {
                        general = documents[0].general;
                        statuses = documents[0].friend_reading_status_update;
                      }
                    });
              } catch (error) {
                  console.log(error);
              }
              if (!general) {
                continue;
              }
              if (!statuses) {
                continue;
              }
              backend.sendNotification(friendId, name + " has updated " + title + "!", name + " has set the status of " + title + " to " + state);
          }
        } catch (error) {
          console.log(error);
        }
      })
      .catch((error) => {
        console.error("Error fetching user ID:", error);
      });
    })
    .catch((error) => {
      console.log("Error fetching user ID:", error);
    });

}

export const BookInfoModal = ({ route, navigation }) => {
  const bookInfo = useContext(BookInfoWrapperContext);
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
    if (newStatus === BookState.Read) {
      navigation.navigate("review", { bookInfo: bookInfo });
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

  const handlePress = () => {
    if (status === BookState.None) {
      navigation.navigate("review", { bookInfo: bookInfo });
      setStatus(BookState.Read);
      saveStatus(BookState.Read);
    }
  };

  const handleOptionSelect = (state: any, title: any) => {
    setStatus(BookStateLookup(state));
    saveStatus(BookStateLookup(state));
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
          {/* <StatusButtonView /> */}
          {/* <SelectDropdown
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
          /> */}
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
                    // paddingVertical: 5,
                    paddingBottom: 11,
                    borderRadius: 13,
                    width: "28%",
                    // alignContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <Text style={{ fontSize: 14, color: "black" }}>
                    {(selectedItem && selectedItem.title) || ""}
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
            renderItem={(item, index, isSelected) => {
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
