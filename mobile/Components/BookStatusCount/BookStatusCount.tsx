import ID from "@/Constants/ID";
import { client } from "@/appwrite";
import { Account, Databases, Query } from "appwrite";
import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { Divider } from "react-native-paper";
function BookStatusCount() {
  const [booksReadCount, setBooksReadCount] = React.useState(0);
  const [booksCurrReadingCount, setBooksCurrReadingCount] = React.useState(0);
  const [booksWantToReadCount, setBooksWantToReadCount] = React.useState(0);
  const [booksDidNotFinishCount, setBooksDidNotFinishCount] = React.useState(0);

  React.useEffect(() => {
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
