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
import { Account } from "appwrite";
import { useEffect, useState } from "react";
import { BACKEND_API_BOOK_SEARCH_URL } from "../../Constants/URLs";

const Tab = createMaterialTopTabNavigator();

let shelf = "Recommended";

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

const promise = account.get();
let userID;

promise.then(
  function (response) {
    //console.log(response); // Success
    userID = response.$id;
    console.log(userID);
  },
  function (error) {
    console.log(error); // Failure
  },
);

function RecommendedCarousel() {
  const [books, setBooks] = useState([]);
  React.useEffect(() => {
    async function getBooks(title) {
      let res = await fetch(
        `${BACKEND_API_BOOK_SEARCH_URL}?` +
          new URLSearchParams({
            title: title,
          }),
      );

      const res_json = await res.json();
      return res_json.results.documents.map((book) => {
        return {
          id: book.$id,
          title: book.title,
          author: book.authors[0].name,
          summary: book.description,
          image_url: book.editions[0].thumbnail_url,
          isbn: book.editions[0].isbn_13,
          genre: book.genre,
        };
      });
    }

    async function getHardcodedBooks() {
      const book_titles = [
        "The Poppy War",
        "The Dragon Republic",
        "Ordinary Monsters",
        "Foundryside",
      ];
      let book_data = [];

      for (const book_title of book_titles) {
        book_data.push(...(await getBooks(book_title)));
      }

      return book_data;
    }

    getHardcodedBooks().then((data) => {
      setBooks(data);
    });
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <Carousel books={books} shelf={shelf} />
    </View>
  );
}

function CarouselTabs({ navigation }) {
  return (
    <Tab.Navigator
      screenOptions={{ swipeEnabled: false }}
      tabBar={(props) => <MyTabBar {...props} />}
    >
      <Tab.Screen
        name="Recommended"
        component={RecommendedCarousel}
        listeners={{
          tabPress: (e) => {
            shelf = "Recommended";
          },
        }}
      />
    </Tab.Navigator>
  );
}

export default CarouselTabs;
