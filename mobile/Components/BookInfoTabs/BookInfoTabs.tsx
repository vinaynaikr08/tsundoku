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
import Ionicons from "react-native-vector-icons/Ionicons";

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

function BookReviewsTab() {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        bounces={false}
        contentContainerStyle={styles.scrollViewStyle}
      >
        <TouchableOpacity activeOpacity={1}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 5 }}>
            Overall Rating:
          </Text>
          <View
            style={{
              flexDirection: "row",
              marginBottom: 40,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 30, fontWeight: "bold", marginRight: 12 }}>
              4.9
            </Text>
            <FontAwesome name={"star"} color={Colors.BUTTON_PURPLE} size={40} />
            <FontAwesome name={"star"} color={Colors.BUTTON_PURPLE} size={40} />
            <FontAwesome name={"star"} color={Colors.BUTTON_PURPLE} size={40} />
            <FontAwesome name={"star"} color={Colors.BUTTON_PURPLE} size={40} />
            <FontAwesome name={"star"} color={Colors.BUTTON_PURPLE} size={40} />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ marginRight: 10 }}>
              <Ionicons name={"person-circle"} color={"grey"} size={60} />
            </View>
            <View style={{ marginRight: 10 }}>
              <Text style={{ fontSize: 20, marginBottom: 5 }}>Sarah Luo</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <FontAwesome
                  name={"star"}
                  color={Colors.BUTTON_PURPLE}
                  size={30}
                />
                <FontAwesome
                  name={"star"}
                  color={Colors.BUTTON_PURPLE}
                  size={30}
                />
                <FontAwesome
                  name={"star"}
                  color={Colors.BUTTON_PURPLE}
                  size={30}
                />
                <FontAwesome
                  name={"star"}
                  color={Colors.BUTTON_PURPLE}
                  size={30}
                />
                <FontAwesome
                  name={"star-o"}
                  color={Colors.BUTTON_PURPLE}
                  size={30}
                />
              </View>
            </View>
          </View>
          <Text
            style={{
              fontSize: 15,
              margin: Dimensions.BOOK_INFO_MODAL_SUMMARY_MARGIN,
            }}
          >
            I love this book! Reading this altered my brain chemistry. I
            seriously recommend this book. I love how it integrates asian
            history and culture. This is the book I needed when I was younger!
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: 10,
                marginTop: 10,
              }}
            >
              <FontAwesome name={"thumbs-o-up"} color={"grey"} size={30} />
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: 20,
              }}
            >
              <FontAwesome name={"thumbs-o-down"} color={"grey"} size={30} />
            </View>
          </View>
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
            in Nikan—was even more surprising.
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
  },
});
