import { Text, View, ScrollView, Pressable } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Databases, Account } from "appwrite";
import React, { useEffect } from "react";
import { Query } from "appwrite";

import Carousel from "@/Components/Carousel/Carousel";
import ID from "@/Constants/ID";
import Colors from "@/Constants/Colors";
import { client } from "@/appwrite";

const Tab = createMaterialTopTabNavigator();

let shelf = "Currently Reading";

const account = new Account(client);
const databases = new Databases(client);

async function getBooksOfStatus(status: string) {
  let books = [];
  let user_id;
  try {
    user_id = (await account.get()).$id;
  } catch (error: any) {
    console.warn("LibraryCarouselTabs: an unknown error occurred attempting to fetch user details.");
    return books;
  }
  let documents = (
    await databases.listDocuments(ID.mainDBID, ID.bookStatusCollectionID, [
      Query.equal("user_id", user_id),
      Query.equal("status", status),
    ])
  ).documents;

  await Promise.all(
    documents.map(async (document) => {
      const book_data = await databases.getDocument(
        ID.mainDBID,
        ID.bookCollectionID,
        document.book.$id,
      );
      books.push({
        id: book_data.$id,
        title: book_data.title,
        author: book_data.authors[0].name,
        summary: book_data.description,
        image_url: book_data.editions[0].thumbnail_url,
        isbn: book_data.editions[0].isbn_13,
        genre: book_data.genre,
      });
    }),
  );

  return books;
}

function MyTabBar({ state, descriptors, navigation }) {
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

function ReadingStatusCarousel({ status }) {
  const [books, setBooks] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      setBooks(await getBooksOfStatus(status));
    })();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Carousel books={books} shelf={shelf} />
    </View>
  );
}

function LibraryCarouselTabs() {
  React.useEffect(() => {
    shelf = "Currently Reading";
  });
  return (
    <Tab.Navigator
      screenOptions={{ swipeEnabled: false }}
      tabBar={(props) => <MyTabBar {...props} />}
    >
      <Tab.Screen
        name="Currently Reading"
        children={() => <ReadingStatusCarousel status="CURRENTLY_READING" />}
        listeners={{
          tabPress: (e) => {
            shelf = "Currently Reading";
          },
        }}
      />
      <Tab.Screen
        name="Want To Read"
        children={() => <ReadingStatusCarousel status="WANT_TO_READ" />}
        listeners={{
          tabPress: (e) => {
            shelf = "Want To Read";
          },
        }}
      />
      <Tab.Screen
        name="Read"
        children={() => <ReadingStatusCarousel status="READ" />}
        listeners={{
          tabPress: (e) => {
            shelf = "Read";
          },
        }}
      />
      <Tab.Screen
        name="Did Not Finish"
        children={() => <ReadingStatusCarousel status="DID_NOT_FINISH" />}
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
