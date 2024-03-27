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

function ReadingStatusCarousel({ navigation, status, shelf }) {
  const { data, error, isLoading, mutate } = useSWR(
    status,
    backend.getBooksOfStatus,
  );

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // Screen is focused again, refetch book status
      mutate();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{ flex: 1 }}>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <Carousel books={data} shelf={shelf} />
      )}
    </View>
  );
}

function LibraryCarouselTabs({ navigation }) {
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
            navigation={navigation}
            status="CURRENTLY_READING"
            shelf={shelf}
          />
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
          <ReadingStatusCarousel
            navigation={navigation}
            status="WANT_TO_READ"
            shelf={shelf}
          />
        )}
        listeners={{
          tabPress: (e) => {
            setShelf("Want To Read");
          },
        }}
      />
      <Tab.Screen
        name="Read"
        children={() => (
          <ReadingStatusCarousel
            navigation={navigation}
            status="READ"
            shelf={shelf}
          />
        )}
        listeners={{
          tabPress: (e) => {
            setShelf("Read");
          },
        }}
      />
      <Tab.Screen
        name="Did Not Finish"
        children={() => (
          <ReadingStatusCarousel
            navigation={navigation}
            status="DID_NOT_FINISH"
            shelf={shelf}
          />
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
