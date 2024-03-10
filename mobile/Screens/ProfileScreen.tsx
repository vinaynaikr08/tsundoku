import React, { useEffect, useState } from "react";
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
import { BookInfoContext, NavigationContext } from "../Contexts";
import { SafeAreaView } from "react-native-safe-area-context";
import { Divider } from "react-native-paper";
import { Button, Icon, Overlay } from "@rneui/themed";
import { LoginStateContext } from "@/Providers/LoginStateProvider";
import ProfileTabs from "@/Components/ProfileTabs/ProfileTabs";

const databases = new Databases(client);

export const Profile = (props) => {
  const { setLoggedIn } = React.useContext(LoginStateContext);
  const { navigation } = props;
  const account = new Account(client);
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
        const databases = new Databases(client);
        const promise = databases.listDocuments(
          ID.mainDBID,
          ID.bookStatusCollectionID,
          [Query.equal("user_id", user_id)],
        );

        promise.then(
          function (response) {
            const documents = response.documents;
            let readCount = 0;
            let currReadingCount = 0;
            let wantToReadCount = 0;
            let didNotFinishCount = 0;

            documents.forEach((doc) => {
              switch (doc.status) {
                case "READ":
                  readCount++;
                  break;
                case "CURRENTLY_READING":
                  currReadingCount++;
                  break;
                case "WANT_TO_READ":
                  wantToReadCount++;
                  break;
                case "DID_NOT_FINISH":
                  didNotFinishCount++;
                  break;
                default:
                  break;
              }
            });
            setBooksReadCount(readCount);
            setBooksCurrReadingCount(currReadingCount);
            setBooksWantToReadCount(wantToReadCount);
            setBooksDidNotFinishCount(didNotFinishCount);
          },
          function (error) {
            console.log(error);
          },
        );
      })
      .catch((error) => {
        console.error("Error fetching user ID:", error);
      });
  }, []);

  function signOut() {
    (async () => {
      await account.deleteSessions();
    })();
    setLoggedIn(false);
  }

  return (
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
    // <SafeAreaView style={{ flex: 1 }}>
    //   <Text style={styles.text}>Profile</Text>
    //   <Text style={styles.text}>Books read: {booksReadCount}</Text>
    //   <Text style={styles.text}>
    //     Books currently reading: {booksCurrReadingCount}
    //   </Text>
    //   <Text style={styles.text}>
    //     Books want to read: {booksWantToReadCount}
    //   </Text>
    //   <Text style={styles.text}>
    //     Books did not finish: {booksDidNotFinishCount}
    //   </Text>
    //   <Divider />
    //   <TouchableOpacity onPress={() => navigation.navigate("notifModal")}>
    //     <View
    //       style={{
    //         flexDirection: "row",
    //         paddingTop: 12,
    //         paddingBottom: 12,
    //         width: "100%",
    //       }}
    //     >
    //         <Text style={{ fontSize: 20, paddingLeft: 20, flex: 9 }}>
    //           Notifications
    //         </Text>
    //         <View style={{ flex: 2 }}>
    //           <Icon name="notifications" color={Colors.BUTTON_PURPLE} size={30} />
    //         </View>
    //     </View>
    //   </TouchableOpacity>

    //   <Divider />

    //   <TouchableOpacity onPress={signOut}>
    //     <View
    //       style={{
    //         flexDirection: "row",
    //         paddingTop: 12,
    //         paddingBottom: 12,
    //         width: "100%",
    //       }}
    //     >
    //       <Text style={{ fontSize: 20, paddingLeft: 20, flex: 9 }}>
    //         Sign Out
    //       </Text>
    //       <View style={{ flex: 2 }}>
    //         <Icon name="logout" color={Colors.BUTTON_PURPLE} size={30} />
    //       </View>
    //     </View>
    //   </TouchableOpacity>

    //   <Divider />

    //   <View style={{ paddingTop: 70, alignItems: "center" }}>
    //     <Button
    //       onPress={toggleOverlay}
    //       color={"red"}
    //       containerStyle={{ borderRadius: 30 }}
    //     >
    //       <Text
    //         style={{
    //           color: "white",
    //           paddingRight: 5,
    //           fontSize: 17,
    //           paddingTop: 5,
    //           paddingBottom: 5,
    //           alignSelf: "center",
    //         }}
    //       >
    //         Delete Account
    //       </Text>
    //     </Button>
    //   </View>
    //   <View style={{ height: 300 }}>
    //     <Overlay isVisible={overlayVisible} onBackdropPress={toggleOverlay}>
    //       <Text style={{ fontSize: 30 }}>Delete account placeholder</Text>
    //     </Overlay>
    //   </View>
    // </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    margin: 30,
  },
});
