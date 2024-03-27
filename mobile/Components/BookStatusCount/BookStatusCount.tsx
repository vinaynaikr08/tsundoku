import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Query } from "appwrite";
import { client } from "@/appwrite";
import { Databases, Account } from "appwrite";
import ID from "@/Constants/ID";
import { Divider } from "react-native-paper";
function BookStatusCount() {
  const [booksReadCount, setBooksReadCount] = useState(0);
  const [booksCurrReadingCount, setBooksCurrReadingCount] = useState(0);
  const [booksWantToReadCount, setBooksWantToReadCount] = useState(0);
  const [booksDidNotFinishCount, setBooksDidNotFinishCount] = useState(0);

  useEffect(() => {
    const account = new Account(client);
    account
      .get()
      .then((response) => {
        const user_id = response.$id;
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
    <ScrollView
      testID="profile-tab-scroll-view"
      style={{ flex: 1, marginLeft: -120 }}
      bounces={false}
      contentContainerStyle={styles.scrollViewStyle}
      showsVerticalScrollIndicator={false}
    >
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
      <Divider />
    </ScrollView>
  );
}

export default BookStatusCount;

const styles = StyleSheet.create({
  scrollViewStyle: {
    paddingHorizontal: 5,
    backgroundColor: "white",
  },
  text: {
    fontSize: 20,
    margin: 20,
  },
});
