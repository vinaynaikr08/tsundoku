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
      <Carousel currentShelf={"Want To Read"} />
    </View>
  );
}

function ReadCarousel() {
  return (
    <View style={{ flex: 1 }}>
      <Carousel currentShelf={"Read"} />
    </View>
  );
}

function DNFCarousel() {
  return (
    <View style={{ flex: 1 }}>
      <Carousel currentShelf={"Did Not Finish"} />
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
