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
  Image,
  FlatList,
  RefreshControl,
  ActivityIndicator,
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

async function getBookInfo(book_id: string) {
  let bookInfo = [];
  const account = new Account(client);
  let user_id;
  try {
    user_id = (await account.get()).$id;
  } catch (error: any) {
    console.warn("An unknown error occurred attempting to fetch user details.");
    return bookInfo;
  }
  const book_document = await databases.getDocument(
    ID.mainDBID,
    ID.bookCollectionID,
    book_id,
  );
  if (book_document) {
    bookInfo.push({
      id: book_document.$id,
      title: book_document.title,
      author: book_document.authors[0].name,
      image_url: book_document.editions[0].thumbnail_url,
    });
  }
  return bookInfo;
}

async function getActivity(book_id: string) {
  // const activity = [];
  let activity = [];
  const account = new Account(client);
  const uniqueActivity = new Map();
  let user_id;
  try {
    user_id = (await account.get()).$id;
  } catch (error: any) {
    console.warn("An unknown error occurred attempting to fetch user details.");
    return activity;
  }
  let documents = (
    await databases.listDocuments(
      ID.mainDBID,
      ID.bookStatusCollectionID,
      // TODO: make it so only friend activity appears
      //  [ Query.equal("user_id", user_id) ]
    )
  ).documents;

  await Promise.all(
    documents.map(async (document) => {
      const bookInfo = await getBookInfo(document.book.$id);
      console.log(bookInfo);
      activity.push({
        key: document.$id,
        status: document.status,
        username: document.user_id,
        book: bookInfo[0],
        timestamp: document.$createdAt,
      });
    }),
  );
  activity.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );
  return activity;
}

function FriendsTab(bookInfo) {
  const [activity, setActivity] = React.useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    refreshActivity();
  }, []);

  const refreshActivity = async () => {
    setRefreshing(true);
    try {
      setActivity([]);
      const refreshedActivity = await getActivity(bookInfo.id);
      setActivity(refreshedActivity);
    } catch (error) {
      console.error("Error refreshing reviews:", error);
    } finally {
      setRefreshing(false);
    }
  };

  React.useEffect(() => {
    (async () => {
      setActivity(await getActivity(bookInfo.id));
    })();
  }, []);
  // const { navigation } = useContext(ProfileContext);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: "white" }}>
        {refreshing ? (
          <ActivityIndicator size="large" color="grey" />
        ) : (
          <View style={{ flex: 1, backgroundColor: "white" }}>
            {activity.length === 0 ? (
              <ScrollView
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={refreshActivity}
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
                  data={activity}
                  showsVerticalScrollIndicator={false}
                  keyExtractor={(item) => item.key}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={refreshActivity}
                    />
                  }
                  renderItem={({ item }) => (
                    <View style={styles.cardContainer}>
                      <TouchableOpacity
                        activeOpacity={1}
                        style={{ flexDirection: "row" }}
                      >
                        <View style={{ flex: 1 }}>
                          {item.status === "READ" && (
                            <Text style={styles.statusText}>
                              {`${item.username} finished reading:\n${item.book.title}`}
                            </Text>
                          )}
                          {item.status === "CURRENTLY_READING" && (
                            <Text style={styles.statusText}>
                              {`${item.username} started reading:\n${item.book.title}`}
                            </Text>
                          )}
                          {item.status === "WANT_TO_READ" && (
                            <Text style={styles.statusText}>
                              {`${item.username} wants to read:\n${item.book.title}`}
                            </Text>
                          )}
                          <Text
                            style={{
                              fontSize: 15,
                              marginLeft:
                                Dimensions.BOOK_INFO_MODAL_SUMMARY_MARGIN,
                              marginBottom:
                                Dimensions.BOOK_INFO_MODAL_SUMMARY_MARGIN,
                            }}
                          >
                            {new Date(item.timestamp).toLocaleString()}
                          </Text>
                          <Text
                            style={{
                              fontSize: 15,
                              marginLeft:
                                Dimensions.BOOK_INFO_MODAL_SUMMARY_MARGIN,
                              marginBottom:
                                Dimensions.BOOK_INFO_MODAL_SUMMARY_MARGIN,
                            }}
                          >
                            {`by ${item.book.author}`}
                          </Text>
                        </View>
                        <Image
                          source={{ uri: item.book.image_url }}
                          style={styles.bookCoverImage}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                />
              </View>
            )}
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
  cardContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 10,
    // marginBottom: 10,
    margin: 15,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
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
  statusText: {
    fontSize: 17,
    margin: Dimensions.BOOK_INFO_MODAL_SUMMARY_MARGIN,
  },
  timestampText: {
    fontSize: 15,
  },
  bookCoverImage: {
    width: 80,
    height: 120,
    margin: Dimensions.BOOK_INFO_MODAL_SUMMARY_MARGIN,
    resizeMode: "cover",
    borderRadius: 5,
  },
});
