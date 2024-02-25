import * as React from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
} from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Carousel from "../Carousel/Carousel";
import Colors from "../../Constants/Colors";
import { client } from "../../appwrite";
import { Databases, Account } from "appwrite";
import { useEffect, useState } from "react";
import ID from "../../Constants/ID";
import { BACKEND_API_BOOK_SEARCH_URL } from "../../Constants/URLs";
import { Query } from "appwrite";

const Tab = createMaterialTopTabNavigator();

let shelf = "Currently Reading";
export { shelf };

function MyTabBar({ state, descriptors, navigation, position }) {
  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10, paddingHorizontal: 15 }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;
          const isFocused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };
          return (
            <Pressable
              key={index}
              onPress={onPress}
              style={{
                flex: 1,
                marginHorizontal: 5,
                backgroundColor: isFocused
                  ? Colors.BUTTON_PURPLE
                  : Colors.BUTTON_GRAY,
                borderRadius: 25,
                padding: 10,
                paddingHorizontal: 15,
              }}
            >
              <Text
                style={{
                  fontWeight: "600",
                  fontSize: 14,
                  color: isFocused ? "white" : "#777777",
                }}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const account = new Account(client);

const user = account.get();
let userID;

user.then(
  function (response) {
    //console.log(response); // Success
    userID = response.$id;
    //console.log(userID);
  },
  function (error) {
    console.log(error); // Failure
  },
);

// async function getStatuses() {
//   let res = await fetch(
//     `host/api/v0/bookstatus?` +
//       new URLSearchParams({
//         user_id: userID,
//       }),
//   );

//   const res_json = await res.json();
//   console.log(res_json);
//   return res_json.results.documents.map((bookStatus) => {
//     return {
//       bookID: bookStatus.book,
//       status: bookStatus.status,
//     };
//   });
// }

// async function getBooks(id) {
//   let res = await fetch(
//     `${BACKEND_API_BOOK_SEARCH_URL}?` +
//       new URLSearchParams({
//         id: id,
//       }),
//   );
//   const res_json = await res.json();
//   return res_json.results.documents.map((book) => {
//     return {
//       id: book.$id,
//       title: book.title,
//       author: book.authors[0].name,
//       image_url: book.editions[0].thumbnail_url,
//     };
//   });
// }

// async function getCurrentlyReadingBooks() {
//   const bookStatuses = await getStatuses();
//   console.log(bookStatuses);
//   let booklist = [];

//   for(const status of bookStatuses) {
//     if (status.status == "CURRENTLY_READING") {
//       booklist.push(...(await getBooks(status.bookID)));
//     }
//   }
//   return booklist;
// }
const databases = new Databases(client);

const promise = databases.listDocuments(
  ID.mainDBID,
  ID.bookStatusCollectionID,
  [Query.equal("user_id", userID as unknown as string)],
);

let read = [];
let currReading = [];
let wantToRead = [];
let didNotFinish = [];

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

        documents.forEach((doc) => {
          switch (doc.status) {
            case "READ":
              read.push(doc);
              break;
            case "CURRENTLY_READING":
              console.log("adding book to read:" + doc.book.$id)
              currReading.push(doc);
              break;
            case "WANT_TO_READ":
              wantToRead.push(doc);
              break;
            case "DID_NOT_FINISH":
              didNotFinish.push(doc);
              break;
            default:
              break;
          }
        });
      },
      function (error) {
        console.log(error);
      },
    );
  })
  .catch((error) => {
    console.error("Error fetching user ID:", error);
  });

function CurrentlyReadingCarousel() {
  const [books, setBooks] = useState([]);
  useEffect(() => {
    async function getBooks(id) {
      let res = await fetch(
        `${BACKEND_API_BOOK_SEARCH_URL}?` +
          new URLSearchParams({
            _id: id,
          }),
      );
      const res_json = await res.json();
      return res_json.results.documents.map((book) => {
        return {
          id: book.$id,
          title: book.title,
          author: book.authors[0].name,
          image_url: book.editions[0].thumbnail_url,
        };
      });
    }

    async function getCurrentlyReadingBooks() {
      let booklist = [];
      console.log("currReading: " + currReading)

      for (const book of currReading) {
        booklist.push(...(await getBooks(book.book.$id)));
      }
      return booklist;
    }

    getCurrentlyReadingBooks().then((data) => {
      setBooks(data);
    });
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <Carousel books={books} />
    </View>
  );
}

function WantToReadCarousel() {
  return <View style={{ flex: 1 }}>{/* <Carousel books={books} /> */}</View>;
}

function ReadCarousel() {
  return (
    <View style={{ flex: 1 }}>{/* <Carousel currentShelf={"Read"} /> */}</View>
  );
}

function DNFCarousel() {
  return (
    <View style={{ flex: 1 }}>
      {/* <Carousel currentShelf={"Did Not Finish"} /> */}
    </View>
  );
}

function LibraryCarouselTabs({ navigation }) {
  return (
    <Tab.Navigator
      screenOptions={{ swipeEnabled: false }}
      tabBar={(props) => <MyTabBar {...props} />}
    >
      <Tab.Screen
        name="Currently Reading"
        component={CurrentlyReadingCarousel}
        listeners={{
          tabPress: (e) => {
            shelf = "Currently Reading";
          },
        }}
      />
      <Tab.Screen
        name="Want To Read"
        component={WantToReadCarousel}
        listeners={{
          tabPress: (e) => {
            shelf = "Want To Read";
          },
        }}
      />
      <Tab.Screen
        name="Read"
        component={ReadCarousel}
        listeners={{
          tabPress: (e) => {
            shelf = "Read";
          },
        }}
      />
      <Tab.Screen
        name="Did Not Finish"
        component={DNFCarousel}
        listeners={{
          tabPress: (e) => {
            shelf = "Did Not Finish";
          },
        }}
      />
    </Tab.Navigator>
  );
}

export default LibraryCarouselTabs;
