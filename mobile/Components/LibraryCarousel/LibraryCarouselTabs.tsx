import {
  Text,
  View,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React from "react";

import Carousel from "@/Components/Carousel/Carousel";
import Colors from "@/Constants/Colors";
import Backend from "@/Backend";
import useSWR from "swr";
import { useFocusEffect } from "@react-navigation/native";
import ErrorModal from "../ErrorModal";

const Tab = createMaterialTopTabNavigator();
const backend = new Backend();

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

function ReadingStatusCarousel({ status, shelf }) {
  const { data, error, isLoading, mutate } = useSWR(
    { status },
    backend.getBookStatuses,
  );

  useFocusEffect(() => {
    mutate();
  });

  if (error) {
    return (
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "500",
            textAlign: "center",
            margin: 10,
          }}
        >
          An error occurred fetching the book statuses.
        </Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1 }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <>
      <View style={{ flex: 1 }}>
        <Carousel books={data} shelf={shelf} />
      </View>
    </>
  );
}

function LibraryCarouselTabs() {
  const [shelf, setShelf] = React.useState("Currently Reading");

  return (
    <Tab.Navigator
      screenOptions={{ swipeEnabled: false }}
      tabBar={(props) => <MyTabBar {...props} />}
    >
      <Tab.Screen
        name="Currently Reading"
        children={() => (
          <ReadingStatusCarousel status="CURRENTLY_READING" shelf={shelf} />
        )}
        listeners={{
          tabPress: (e) => {
            setShelf("Currently Reading");
          },
        }}
      />
      <Tab.Screen
        name="Want To Read"
        children={() => (
          <ReadingStatusCarousel status="WANT_TO_READ" shelf={shelf} />
        )}
        listeners={{
          tabPress: (e) => {
            setShelf("Want To Read");
          },
        }}
      />
      <Tab.Screen
        name="Read"
        children={() => <ReadingStatusCarousel status="READ" shelf={shelf} />}
        listeners={{
          tabPress: (e) => {
            setShelf("Read");
          },
        }}
      />
      <Tab.Screen
        name="Did Not Finish"
        children={() => (
          <ReadingStatusCarousel status="DID_NOT_FINISH" shelf={shelf} />
        )}
        listeners={{
          tabPress: (e) => {
            setShelf("Did Not Finish");
          },
        }}
      />
    </Tab.Navigator>
  );
}

export default LibraryCarouselTabs;
