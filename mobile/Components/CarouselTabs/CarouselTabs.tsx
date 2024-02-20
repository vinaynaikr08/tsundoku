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

const Tab = createMaterialTopTabNavigator();

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
  return (
    <View style={{ flex: 1 }}>
      <Carousel />
    </View>
  );
}

function WantToReadCarousel() {
  return (
    <View style={{ flex: 1 }}>
      <Carousel />
    </View>
  );
}

function ReadCarousel() {
  return (
    <View style={{ flex: 1 }}>
      <Carousel />
    </View>
  );
}

function DNFCarousel() {
  return (
    <View style={{ flex: 1 }}>
      <Carousel />
    </View>
  );
}

function CarouselTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <MyTabBar {...props} />}
    >
      <Tab.Screen
        name="Currently Reading"
        component={CurrentlyReadingCarousel}
      />
      <Tab.Screen name="Want To Read" component={WantToReadCarousel} />
      <Tab.Screen name="Read" component={ReadCarousel} />
      <Tab.Screen name="Did Not Finish" component={DNFCarousel} />
    </Tab.Navigator>
  );
}

export default CarouselTabs;
