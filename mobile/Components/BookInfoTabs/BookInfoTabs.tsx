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
import Carousel from "../Carousel/Carousel";
import Colors from "../../Constants/Colors";
import Dimensions from "../../Constants/Dimensions";

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

function BookReviewsTab() {
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
            Rooster Province could pass without cheating; to Rin’s guardians,
            who believed they’d finally be able to marry her off and further
            their criminal enterprise; and to Rin herself, who realized she was
            finally free of the servitude and despair that had made up her daily
            existence. That she got into Sinegard—the most elite military school
            in Nikan—was even more surprising. But surprises aren’t always good.
            Because being a dark-skinned peasant girl from the south is not an
            easy thing at Sinegard. Targeted from the outset by rival classmates
            for her color, poverty, and gender, Rin discovers she possesses a
            lethal, unearthly power—an aptitude for the nearly-mythical art of
            shamanism. Exploring the depths of her gift with the help of a
            seemingly insane teacher and psychoactive substances, Rin learns
            that gods long thought dead are very much alive—and that mastering
            control over those powers could mean more than just surviving
            school. For while the Nikara Empire is at peace, the Federation of
            Mugen still lurks across a narrow sea.
          </Text>
        </TouchableOpacity>
      </ScrollView>
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
            Hello
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function BookInfoTabs({ bookInfo }) {
  return (
    <Tab.Navigator
      screenOptions={{ animationEnabled: false }}
      tabBar={(props) => <MyTabBar {...props} />}
    >
      <Tab.Screen
        name="Description"
        children={(props) => <DescriptionTab bookInfo={bookInfo} {...props} />}
      />
      <Tab.Screen name="Reviews" component={BookReviewsTab} />
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
    //   flexGrow: 1,
  },
});
