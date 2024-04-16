import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import Backend from "@/Backend";
import Carousel from "@/Components/Carousel/Carousel";
import Colors from "@/Constants/Colors";
import { useFocusEffect } from "@react-navigation/native";
import useSWR from "swr";

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

function ReadingStatusCarousel({ status, shelf, user_id }) {
  const { data, error, isLoading, mutate } = useSWR(
    { status, user_id },
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

function LibraryCarouselTabs({ user_id }: { user_id: string }) {
  const [shelf, setShelf] = React.useState("Currently Reading");

  return (
    <Tab.Navigator
      screenOptions={{ swipeEnabled: false }}
      tabBar={(props) => <MyTabBar {...props} />}
    >
      <Tab.Screen
        name="Currently Reading"
        children={() => (
          <ReadingStatusCarousel
            status="CURRENTLY_READING"
            shelf={shelf}
            user_id={user_id}
          />
        )}
        listeners={{
          tabPress: () => {
            setShelf("Currently Reading");
          },
        }}
      />
      <Tab.Screen
        name="Want To Read"
        children={() => (
          <ReadingStatusCarousel
            status="WANT_TO_READ"
            shelf={shelf}
            user_id={user_id}
          />
        )}
        listeners={{
          tabPress: () => {
            setShelf("Want To Read");
          },
        }}
      />
      <Tab.Screen
        name="Read"
        children={() => (
          <ReadingStatusCarousel
            status="READ"
            shelf={shelf}
            user_id={user_id}
          />
        )}
        listeners={{
          tabPress: () => {
            setShelf("Read");
          },
        }}
      />
      <Tab.Screen
        name="Did Not Finish"
        children={() => (
          <ReadingStatusCarousel
            status="DID_NOT_FINISH"
            shelf={shelf}
            user_id={user_id}
          />
        )}
        listeners={{
          tabPress: () => {
            setShelf("Did Not Finish");
          },
        }}
      />
    </Tab.Navigator>
  );
}

export default LibraryCarouselTabs;
