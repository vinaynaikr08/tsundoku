import React, { useEffect, useState } from "react";
import BookInfoModal from "../Components/BookInfoModal";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Switch,
} from "react-native";
import { Query } from "appwrite";
import { client } from "../appwrite";
import { Databases, Account } from "appwrite";
import Colors from "../Constants/Colors";
import ID from "../Constants/ID";
import { BookInfoContext, NavigationContext } from "../Contexts";
import { SafeAreaView } from "react-native-safe-area-context";
import { Divider } from "react-native-paper";
import { Button, Icon } from "@rneui/themed";
const databases = new Databases(client);

export const Profile = (props) => {
  // const user_id = request.nextUrl.searchParams.get("user_id");
  // const user_id = account.get();
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
  const [notif, setNotif] = useState(false);

  useEffect(() => {
    const account = new Account(client);
    account
      .get()
      .then((response) => {
        const user_id = response.$id; // user id in $id ?
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

  return (
    // <BookInfoContext.Provider value={bookInfo}>
    <SafeAreaView style={{ flex: 1 }}>
      <Text style={styles.text}>Profile</Text>
      <Text style={styles.text}>Books read: {booksReadCount}</Text>
      <Text style={styles.text}>
        Books currently reading: {booksCurrReadingCount}
      </Text>
      <Text style={styles.text}>
        Books want to read: {booksWantToReadCount}
      </Text>
      <Text style={styles.text}>
        Books did not finish: {booksDidNotFinishCount}
      </Text>
      <Divider/>
      <View style={{flexDirection: 'row', paddingTop: 10, paddingBottom: 10, width: '100%'}}>
        <Text style={{fontSize: 20, paddingLeft: 20, flex: 9}}>Notifications</Text>
        <View style={{flex: 2}}>
          <Switch
            trackColor={{false: Colors.BUTTON_GRAY, true: Colors.BUTTON_PURPLE}}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => (setNotif(!notif))}
            value={notif}
          />
        </View>
      </View>
      <Divider/>
      <View style={{paddingTop: 30, alignItems: 'center'}}>
        <Button
          onPress={() => null}
          color={Colors.BUTTON_PURPLE}
          containerStyle={{borderRadius: 30, width: 125}}
        >
          <Text style={{color: 'white', paddingRight: 5, fontSize: 17, paddingTop: 5, paddingBottom: 5}}>Sign Out</Text>
          <Icon name="logout" color="white" size={20}/>
        </Button>
      </View>
    </SafeAreaView>
    // </BookInfoContext.Provider>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    margin: 30,
  },
});
