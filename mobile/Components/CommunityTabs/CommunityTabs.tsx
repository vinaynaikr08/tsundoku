import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Switch,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  FlatList,
  RefreshControl,
} from "react-native";
import { Query } from "appwrite";
import { client } from "@/appwrite";
import { Databases, Account } from "appwrite";
import Colors from "@/Constants/Colors";
import ID from "@/Constants/ID";
import { ProfileContext } from "../../Contexts";
import { SafeAreaView } from "react-native-safe-area-context";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useFocusEffect } from "@react-navigation/native";
import Dimensions from "@/Constants/Dimensions";

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
const databases = new Databases(client);

async function getReviews(book_id: string) {
  let reviews = [];
  let documents = (
    await databases.listDocuments(ID.mainDBID, ID.reviewsCollectionID, [
      Query.equal("book", book_id),
    ])
  ).documents;

  await Promise.all(
    documents.map(async (document) => {
      const review_data = await databases.getDocument(
        ID.mainDBID,
        ID.reviewsCollectionID,
        document.$id,
      );

      reviews.push({
        rating: review_data.star_rating,
        desc: review_data.description,
        username: review_data.user_id,
        id: document.$id,
      });
    }),
  );

  return reviews;
}
function FriendsTab(bookInfo) {
  //   const { navigation } = props;
  const [reviews, setReviews] = React.useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    refreshReviews();
  }, []);

  const refreshReviews = async () => {
    setRefreshing(true);
    try {
      const refreshedReviews = await getReviews(bookInfo.id);
      setReviews(refreshedReviews);
    } catch (error) {
      console.error("Error refreshing reviews:", error);
    } finally {
      setRefreshing(false);
    }
  };

  React.useEffect(() => {
    (async () => {
      setReviews(await getReviews(bookInfo.id));
    })();
  }, []);
  // const { navigation } = useContext(ProfileContext);
  const account = new Account(client);
  // const user_id = account.get();
  // const promise = databases.listDocuments(
  //   ID.mainDBID,
  //   ID.bookStatusCollectionID,
  //   [Query.equal("user_id", user_id as unknown as string)],
  // );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: "white" }}>
        {reviews.length === 0 ? (
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={refreshReviews}
              />
            }
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                margin: 30,
                color: "grey",
              }}
            >
              No Activity
            </Text>
          </ScrollView>
        ) : (
          <View style={{ flex: 1 }}>
            <FlatList
              data={reviews}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item) => item.username}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={refreshReviews}
                />
              }
              ListHeaderComponent={() => (
                <View
                  style={{
                    flexDirection: "row",
                    marginVertical: 30,
                    alignItems: "center",
                  }}
                ></View>
              )}
              renderItem={({ item }) => (
                <View style={{ flex: 1 }}>
                  <TouchableOpacity activeOpacity={1}>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <View style={{ marginRight: 10 }}>
                        <Text style={{ fontSize: 20, marginBottom: 5 }}>
                          {item.username}
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={{
                        fontSize: 15,
                        margin: Dimensions.BOOK_INFO_MODAL_SUMMARY_MARGIN,
                      }}
                    >
                      {item.desc}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

function BookClubsTab({}) {
  return (
    <View style={{ flex: 1 }}>
      {/* <BookInfoModalReview bookInfo={bookInfo} /> */}
    </View>
  );
}

function ChallengesTab() {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        bounces={false}
        contentContainerStyle={styles.scrollViewStyle}
      >
        <TouchableOpacity activeOpacity={1}>
          <Text style={{ margin: 10 }}>Hello</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function CommunityTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ animationEnabled: false }}
      tabBar={(props) => <MyTabBar {...props} />}
      sceneContainerStyle={{ backgroundColor: "transparent" }}
    >
      <Tab.Screen name="Friends" children={(props) => <FriendsTab />} />
      <Tab.Screen name="Book Clubs" children={(props) => <BookClubsTab />} />
      <Tab.Screen name="Challenges" component={ChallengesTab} />
    </Tab.Navigator>
  );
}

export default CommunityTabs;

const styles = StyleSheet.create({
  scrollViewStyle: {
    // paddingBottom: 30,
    paddingHorizontal: 5,
    backgroundColor: "white",
  },
  text: {
    fontSize: 20,
    margin: 20,
  },
  userInfoRow: {
    width: "80%",
    flexDirection: "row",
    alignItems: "center",
  },
  userInfoText: {
    fontSize: 20,
    margin: 20,
  },
});
