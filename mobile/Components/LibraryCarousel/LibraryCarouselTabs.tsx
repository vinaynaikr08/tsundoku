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

const account = new Account(client);
const databases = new Databases(client);

async function getBooksOfStatus(status: string) {
  let books = [];
  const user_id = (await account.get()).$id;
  (
    await databases.listDocuments(ID.mainDBID, ID.bookStatusCollectionID, [
      Query.equal("user_id", user_id),
      Query.equal("status", status),
    ])
  ).documents.forEach((doc) => {
    (async () => {
      const book_data = await databases.getDocument(
        ID.mainDBID,
        ID.bookCollectionID,
        doc.book.$id,
      );
      books.push({
        id: book_data.$id,
        title: book_data.title,
        author: book_data.authors[0].name,
        image_url: book_data.editions[0].thumbnail_url,
      });
    })();
  });

  return books;
}

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

function CurrentlyReadingCarousel() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    (async () => {setBooks(await getBooksOfStatus("CURRENTLY_READING"))})();
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
