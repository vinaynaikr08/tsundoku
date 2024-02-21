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
import Dimensions from "../../Constants/Dimensions";

const Tab = createMaterialTopTabNavigator();

function MyTabBar({ state, descriptors, navigation, position, bookInfo }) {
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
                height: 40,
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

function DescriptionTab(bookInfo) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={{ margin: Dimensions.BOOK_INFO_MODAL_SUMMARY_MARGIN }}>
        {bookInfo.summary}
        {/* hello guys */}
      </Text>
    </View>
  );
}

function BookReviewsTab() {
  return (
    <View style={{ flex: 1 }}>
      <Text style={{ margin: Dimensions.BOOK_INFO_MODAL_SUMMARY_MARGIN }}>
        Hi
      </Text>
    </View>
  );
}

function MyNotesTab() {
  return (
    <View style={{ flex: 1 }}>
      <Text style={{ margin: Dimensions.BOOK_INFO_MODAL_SUMMARY_MARGIN }}>
        Hello
      </Text>
    </View>
  );
}

function BookInfoTabs(bookInfo) {
  return (
    <Tab.Navigator
      tabBar={(props) => <MyTabBar bookInfo={bookInfo} {...props} />}
    >
      <Tab.Screen name="Description">
        {(props) => <DescriptionTab {...props} bookInfo={bookInfo} />}
      </Tab.Screen>
      <Tab.Screen name="Reviews" component={BookReviewsTab} />
      <Tab.Screen name="My Notes" component={MyNotesTab} />
    </Tab.Navigator>
  );
}

export default BookInfoTabs;
