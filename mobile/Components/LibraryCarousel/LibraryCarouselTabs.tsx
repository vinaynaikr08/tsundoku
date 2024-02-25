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

const promise = account.get();
let userID;

promise.then(function (response) {
    //console.log(response); // Success
    userID = response.$id;
    console.log(userID);
}, function (error) {
    console.log(error); // Failure
});

async function getStatuses() {
  let res = await fetch(
    `host/api/v0/bookstatus?` +
      new URLSearchParams({
        user_id: userID,
      }),
  );

  const res_json = await res.json();
  console.log(res_json);
  return res_json.results.documents.map((bookStatus) => {
    return {
      bookID: bookStatus.book,
      status: bookStatus.status,
    };
  });
}

async function getBooks(id) {
  let res = await fetch(
    `${BACKEND_API_BOOK_SEARCH_URL}?` +
      new URLSearchParams({
        id: id,
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
  const bookStatuses = await getStatuses();
  console.log(bookStatuses.data);
  let booklist = [];

  for(const status of bookStatuses) {
    if (status.status == "Currently Reading") {
      booklist.push(...(await getBooks(status.bookID)));
    }
  }
  return booklist;
}

function CurrentlyReadingCarousel() {
  //const [statuses, setStatuses] = useState<{ bookID: number, status: string }[]>([]);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    getCurrentlyReadingBooks().then((data) => {
      console.log(data);
      setBooks(data);
    });
    //console.log(books);
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <Carousel books={books} />
    </View>
  );
}

function WantToReadCarousel() {
  return (
    <View style={{ flex: 1 }}>
      {/* <Carousel books={books} /> */}
    </View>
  );
}

function ReadCarousel() {
  return (
    <View style={{ flex: 1 }}>
      {/* <Carousel currentShelf={"Read"} /> */}
    </View>
  );
}

function DNFCarousel() {
  return (
    <View style={{ flex: 1 }}>
      {/* <Carousel currentShelf={"Did Not Finish"} /> */}
    </View>
  );
}

function CarouselTabs({ navigation }) {
  return (
    <Tab.Navigator screenOptions={{swipeEnabled: false}} tabBar={(props) => <MyTabBar {...props} />}>
      <Tab.Screen
        name="Currently Reading"
        component={CurrentlyReadingCarousel}
        listeners={{
          tabPress: e => { shelf = "Currently Reading"; }
        }}
      />
      <Tab.Screen name="Want To Read" component={WantToReadCarousel} listeners={{
          tabPress: e => { shelf = "Want To Read" }
        }}
      />
      <Tab.Screen name="Read" component={ReadCarousel} listeners={{
          tabPress: e => { shelf = "Read" }
        }} 
      />
      <Tab.Screen name="Did Not Finish" component={DNFCarousel} listeners={{
          tabPress: e => { shelf = "Did Not Finish" }
        }}
      />
    </Tab.Navigator>
  );
}

export default CarouselTabs;
