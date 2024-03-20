import * as React from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Colors from "../../Constants/Colors";
import Dimensions from "../../Constants/Dimensions";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import BookInfoModalReview from "../BookInfoModalReview";

const Tab = createMaterialTopTabNavigator();

function MyTabBar({ state, descriptors, navigation, position }) {
  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
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

function DescriptionTab({ bookInfo }) {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        bounces={false}
        contentContainerStyle={styles.scrollViewStyle}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity activeOpacity={1}>
          <Text style={{ margin: Dimensions.BOOK_INFO_MODAL_SUMMARY_MARGIN }}>
            {bookInfo.summary}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function BookReviewsTab({ bookInfo, navigation }) {
  return (
    <View style={{ flex: 1 }}>
      <BookInfoModalReview bookInfo={bookInfo} navigation={navigation} />
    </View>
  );
}

function MyNotesTab() {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        bounces={false}
        contentContainerStyle={styles.scrollViewStyle}
      >
        <TouchableOpacity activeOpacity={1}>
          <Text style={{ margin: Dimensions.BOOK_INFO_MODAL_SUMMARY_MARGIN }}>
            An epic historical military fantasy, inspired by the bloody history
            of China’s twentieth century and filled with treachery and magic.
            When Rin aced the Keju—the Empire-wide test to find the most
            talented youth to learn at the Academies—it was a shock to everyone:
            to the test officials, who couldn’t believe a war orphan from
            Rooster Province could pass without cheating.
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function BookInfoTabs({ bookInfo, navigation }) {
  return (
    <Tab.Navigator
      screenOptions={{ animationEnabled: false }}
      tabBar={(props) => <MyTabBar {...props} />}
    >
      <Tab.Screen
        name="Description"
        children={(props) => <DescriptionTab bookInfo={bookInfo} {...props} />}
      />
      <Tab.Screen
        name="Reviews"
        children={(props) => <BookReviewsTab bookInfo={bookInfo} navigation={navigation} {...props} />}
      />
      <Tab.Screen name="My Notes" component={MyNotesTab} />
    </Tab.Navigator>
  );
}

export default BookInfoTabs;

const styles = StyleSheet.create({
  scrollViewStyle: {
    paddingBottom: 330,
    marginBottom: 100,
    paddingHorizontal: 5,
    backgroundColor: "white",
  },
});
