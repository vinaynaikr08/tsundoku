import Colors from "@/Constants/Colors";
import Dimensions from "@/Constants/Dimensions";
import ID from "@/Constants/ID";
import {
  BACKEND_API_BOOK_STATUS_URL,
  BACKEND_API_READING_CHALLENGES,
  BACKEND_API_URL,
} from "@/Constants/URLs";
import { client } from "@/appwrite";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Account, Databases, Query } from "appwrite";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BookSearchButton from "../BookSearchButton";
import ReadingChallenges from "../ReadingChallenges/ReadingChallenges";
import useSWR from "swr";
import Backend from "@/Backend";

const backend = new Backend();

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
  const bookInfo = [];
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
  const activity = [];
  const account = new Account(client);
  const databases = new Databases(client);

  try {
    const user_id = (await account.get()).$id;
    const friends = await getFriends(user_id, databases);
    if (friends.length == 0) return activity;
    const documents = (
      await databases.listDocuments(ID.mainDBID, ID.bookStatusCollectionID, [
        Query.equal("user_id", friends),
        Query.orderDesc("$createdAt"),
      ])
    ).documents;

    const res = friends.map(async (friendId) => {
      const response = await fetch(
        `${BACKEND_API_URL}/v0/users/${friendId}/name`,
        {
          method: "GET",
          headers: new Headers({
            "Content-Type": "application/json",
            Authorization: "Bearer " + (await account.createJWT()).jwt,
          }),
        },
      );
      const { name } = await response.json();
      return { friendId, name };
    });
    const friendNames = await Promise.all(res);
    await Promise.all(
      documents.map(async (document) => {
        const bookInfo = await getBookInfo(document.book.$id);
        const friendName =
          friendNames.find((friend) => friend.friendId === document.user_id)
            ?.name || "Unknown";
        activity.push({
          key: document.$id,
          status: document.status,
          username: friendName,
          book: bookInfo[0],
          timestamp: document.$createdAt,
        });
      }),
    );

    activity.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

    return activity;
  } catch (error: any) {
    console.log("An unknown error occurred attempting to fetch user details.");
    return activity;
  }
}

async function getFriends(user_id: string, databases: Databases) {
  const response = await databases.listDocuments(
    ID.mainDBID,
    ID.friendsCollectionID,
    [
      Query.or([
        Query.equal("requester", user_id),
        Query.equal("requestee", user_id),
      ]),
    ],
  );

  const documents = response.documents;
  const filtered = documents.filter((doc) => doc.status == "ACCEPTED");
  const friendIds = filtered.map((friend) =>
    user_id == friend.requestee ? friend.requester : friend.requestee,
  );

  return friendIds;
}

function FriendsTab(bookInfo) {
  const [activity, setActivity] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      try {
        refreshActivity();
      } catch (error) {
        console.error("Error refreshing in FriendsTab " + error);
      }
    }, []),
  );

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

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <View style={{ marginHorizontal: 20 }}>
          <BookSearchButton
            navigation={navigation}
            placeholder={"Search all users"}
            navigateTo={"UserSearchScreen"}
          />
        </View>
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
    </View>
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
  const navigation = useNavigation();
  const account = new Account(client);
  const [readingChallenges, setReadingChallenges] = useState([]);
  const user_id = undefined;
  const { data, error, isLoading, mutate } = useSWR(
    { status: "READ", user_id },
    backend.getBookStatusDocs,
  );
  const [loading, setLoading] = useState(false);

  console.log("data array: " + JSON.stringify(data))
  console.log("data: " + data[0].$updatedAt)

  useFocusEffect(() => {
    mutate();
  });

  function Challenge({ info }) {
    const start = new Date(info.startDate);
    const end = new Date(info.endDate);
    const [completed, setCompleted] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      let count = 0;
      for (let i = 0; i < data.length; i++) {
        const bookDate = new Date(data[i].$createdAt);
        if (bookDate <= end && bookDate >= start) {
          count++;
        }
      }
      setCompleted(count);
      setProgress((count / info.bookCount) * 100);
    }, [data]);

    console.log("completed: " + completed);

    return (
      <View
        style={{
          backgroundColor: "white",
          padding: 20,
          alignSelf: "center",
          shadowColor: "black",
          shadowOffset: {
            width: 3,
            height: 4,
          },
          shadowOpacity: 0.15,
          shadowRadius: 5,
          borderRadius: 10,
          width: "90%",
          marginBottom: 10,
        }}
      >
        <Text style={{ textAlign: "center" }}>{info.name}</Text>
        <View
          style={{
            width: "85%",
            paddingVertical: 15,
            backgroundColor: Colors.BUTTON_GRAY,
            borderRadius: 15,
            alignSelf: "center",
            marginVertical: 10,
          }}
        >
          <View
            style={{
              width: `${progress}%`,
              backgroundColor: Colors.BUTTON_PURPLE,
              paddingVertical: 15,
              position: "absolute",
              top: 0,
              left: 0,
              borderRadius: 15,
            }}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: 22,
          }}
        >
          <Text>{completed}</Text>
          <Text>{info.bookCount}</Text>
        </View>
      </View>
    );
  }

  React.useEffect(() => {
    async function getReadingChallenges() {
      try {
        const res = await fetch(`${BACKEND_API_READING_CHALLENGES}`, {
          method: "get",
          headers: new Headers({
            "Content-Type": "application/json",
            Authorization: "Bearer " + (await account.createJWT()).jwt,
          }),
        });

        const res_json = await res.json();
        if (res.ok) {
          //console.log("reading challenges: " + JSON.stringify(res_json));
          return res_json.results.documents.map(
            (challenge: {
              name: any;
              book_count: any;
              start: any;
              end: any;
            }) => {
              return {
                name: challenge.name,
                bookCount: challenge.book_count,
                startDate: challenge.start,
                endDate: challenge.end,
              };
            },
          );
        } else {
          console.log(
            "error getting reading challenges: " + JSON.stringify(res_json),
          );
        }
      } catch (error) {
        console.error(error);
        // setErrorMessage("An error occurred fetching the books.");
        // setErrorModalVisible(true);
      }
    }

    getReadingChallenges()
      .then((data) => {
        setReadingChallenges(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        // setErrorMessage("An error occurred fetching the recommended books.");
        // setErrorModalVisible(true);
      });
  }, []);

  return (
    <ScrollView style={{ flex: 1 }}>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 15,
          marginTop: 10,
        }}
      >
        <TouchableOpacity>
          <Image
            source={require("../../assets/wrapped-banner.png")}
            style={{
              width: "90%",
              height: undefined,
              aspectRatio: 5 / 2,
              borderRadius: 15,
              overflow: "hidden",
            }}
          />
          <View
            style={{
              position: "absolute",
              top: "15%",
              width: 300,
              justifyContent: "center",
              alignSelf: "center",
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 20,
                textAlign: "center",
                fontWeight: "500",
                marginTop: 5,
              }}
            >
              April's Challenge
            </Text>
            <Text
              style={{
                color: "white",
                fontSize: 16,
                textAlign: "center",
                fontWeight: "500",
                marginTop: 15,
              }}
            >
              For April's Challenge, read three self-help books.
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      {readingChallenges.map((challenge, index) => (
        <Challenge key={index} info={challenge} />
      ))}
      <Pressable
        onPress={() => {
          navigation.navigate("createReadingChallenge");
        }}
        style={styles.saveButton}
      >
        <Text style={styles.saveButtonText}>New Reading Challenge</Text>
      </Pressable>
    </ScrollView>
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
  saveButton: {
    backgroundColor: Colors.BUTTON_PURPLE,
    padding: 10,
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 10,
    width: "60%",
    alignSelf: "center",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
});
