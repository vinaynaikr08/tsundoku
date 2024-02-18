import * as React from "react";
import { Button, FlatList, StyleSheet, Text, View } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Carousel from "../Carousel/Carousel";

const Tab = createMaterialTopTabNavigator();

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
      screenOptions={{
        swipeEnabled: false,
        tabBarScrollEnabled: true,
        tabBarIndicator: () => null,
        tabBarStyle: {
          backgroundColor: "white",
        },
        tabBarItemStyle: {
          width: "auto",
          alignItems: "flex-start",
          backgroundColor: "#5B2FA3",
          marginHorizontal: 5,
          marginVertical: 10,
          borderRadius: 25,
        },
        tabBarLabelStyle: {
          fontSize: 13,
          textTransform: "capitalize",
          fontWeight: "500",
          color: "white"
        },
      }}
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
