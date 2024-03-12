import React, { useContext, useEffect, useState } from "react";
import BookInfoModal from "../Components/BookInfoModal";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Switch,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Query } from "appwrite";
import { client } from "../appwrite";
import { Databases, Account } from "appwrite";
import Colors from "../Constants/Colors";
import ID from "../Constants/ID";
import {
  BookInfoContext,
  NavigationContext,
  ProfileContext,
} from "../Contexts";
import { SafeAreaView } from "react-native-safe-area-context";
import { Divider } from "react-native-paper";
import { Button, Icon, Overlay } from "@rneui/themed";
import { LoginStateContext } from "@/Providers/LoginStateProvider";
import ProfileTabs from "@/Components/ProfileTabs/ProfileTabs";

const databases = new Databases(client);

export const Profile = (props) => {
  const { setLoggedIn } = React.useContext(LoginStateContext);
  // const { navigation } = props;
  const account = new Account(client);
  const navigation = useContext(NavigationContext);
  const user_id = account.get();
  const [isBookInfoModalVisible, setIsBookInfoModalVisible] = useState(false);
  const promise = databases.listDocuments(
    ID.mainDBID,
    ID.bookStatusCollectionID,
    [Query.equal("user_id", user_id as unknown as string)],
  );
  const [booksReadCount, setBooksReadCount] = useState(0);
  const [booksCurrReadingCount, setBooksCurrReadingCount] = useState(0);
  const [booksWantToReadCount, setBooksWantToReadCount] = useState(0);
  const [booksDidNotFinishCount, setBooksDidNotFinishCount] = useState(0);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);

  const toggleOverlay = () => {
    setOverlayVisible(!overlayVisible);
  };

  useEffect(() => {
    const account = new Account(client);
    account
      .get()
      .then((response) => {
        const user_id = response.$id; // user id in $id ?
        setUsername(response.name);
        setEmail(response.email);
        const databases = new Databases(client);
        const promise = databases.listDocuments(
          ID.mainDBID,
          ID.bookStatusCollectionID,
          [Query.equal("user_id", user_id)],
        );

        // promise.then(
        //   function (response) {
        //     const documents = response.documents;
        //     let readCount = 0;
        //     let currReadingCount = 0;
        //     let wantToReadCount = 0;
        //     let didNotFinishCount = 0;

        //     documents.forEach((doc) => {
        //       switch (doc.status) {
        //         case "READ":
        //           readCount++;
        //           break;
        //         case "CURRENTLY_READING":
        //           currReadingCount++;
        //           break;
        //         case "WANT_TO_READ":
        //           wantToReadCount++;
        //           break;
        //         case "DID_NOT_FINISH":
        //           didNotFinishCount++;
        //           break;
        //         default:
        //           break;
        //       }
        //     });
        //     setBooksReadCount(readCount);
        //     setBooksCurrReadingCount(currReadingCount);
        //     setBooksWantToReadCount(wantToReadCount);
        //     setBooksDidNotFinishCount(didNotFinishCount);
        //   },
        //   function (error) {
        //     console.log(error);
        //   },
        // );
      })
      .catch((error) => {
        console.error("Error fetching user ID:", error);
      });
  }, []);

  return (
    <ProfileContext.Provider value={props}>
      <SafeAreaView style={{ flexGrow: 1, backgroundColor: "white" }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View>
            <Text
              style={{
                marginLeft: 20,
                marginBottom: 15,
                marginTop: 5,
                fontWeight: "700",
                fontSize: 21,
              }}
            >
              {username}
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <ProfileTabs />
      </SafeAreaView>
    </ProfileContext.Provider>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    margin: 30,
  },
});
