import React from "react";
import {
  Text,
  View,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Carousel from "../Carousel/Carousel";
import Colors from "../../Constants/Colors";
import { BACKEND_API_BOOK_SEARCH_URL } from "../../Constants/URLs";
import ErrorModal from "@/Components/ErrorModal";

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

function RecommendedCarousel() {
  const [books, setBooks] = React.useState(null);
  const [errorModalVisible, setErrorModalVisible] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  React.useEffect(() => {
    async function getBooks(title) {
      try {
        const res = await fetch(
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
      } catch (error) {
        console.error(error);
        setErrorMessage("An error occurred fetching the books.");
        setErrorModalVisible(true);
      }
    }

    async function getHardcodedBooks() {
      const book_titles = [
        "The Poppy War",
        "The Dragon Republic",
        "Ordinary Monsters",
        "Foundryside",
        "Kingdom of Ash",
        "Babel",
        "Yellowface",
        "A Tempest of Tea",
      ];
      let book_data = [];

      for (const book_title of book_titles) {
        book_data.push(...(await getBooks(book_title)));
      }

      return book_data;
    }

    getHardcodedBooks()
      .then((data) => {
        setBooks(data);
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage("An error occurred fetching the recommended books.");
        setErrorModalVisible(true);
      });
  }, []);
  return (
    <>
      <View style={{ flex: 1 }}>
        {books ? (
          <Carousel books={books} shelf={shelf} />
        ) : (
          <ActivityIndicator size="large" />
        )}
      </View>
      <ErrorModal
        message={errorMessage}
        visible={errorModalVisible}
        setVisible={setErrorModalVisible}
      />
    </>
  );
}

function CarouselTabs() {
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
