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
} from "react-native";
import { Query } from "appwrite";
import { client } from "@/appwrite";
import { Databases, Account } from "appwrite";
import Colors from "@/Constants/Colors";
import ID from "@/Constants/ID";
import { ProfileContext } from "../../Contexts";
import { SafeAreaView } from "react-native-safe-area-context";
import { Divider } from "react-native-paper";
import { Button, Icon, Overlay } from "@rneui/themed";
import { LoginStateContext } from "@/Providers/LoginStateProvider";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useFocusEffect } from "@react-navigation/native";

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

function ProfileTab(props) {
  const { setLoggedIn } = React.useContext(LoginStateContext);
  //   const { navigation } = props;
  // const { username } = usernameParam;
  // const { email } = emailParam;
  const { navigation } = useContext(ProfileContext);
  const account = new Account(client);
  const user_id = account.get();
  const [booksReadCount, setBooksReadCount] = useState(0);
  const [booksCurrReadingCount, setBooksCurrReadingCount] = useState(0);
  const [booksWantToReadCount, setBooksWantToReadCount] = useState(0);
  const [booksDidNotFinishCount, setBooksDidNotFinishCount] = useState(0);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const toggleOverlay = () => {
    setOverlayVisible(!overlayVisible);
  };

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const account = new Account(client);
        account
          .get()
          .then((response) => {
            setUsername(response.name);
            setEmail(response.email);
          })
          .catch((error) => {
            console.error("Error fetching user ID:", error);
          });
      })();
    }, []),
  );

  useEffect(() => {
    const account = new Account(client);
    account
      .get()
      .then((response) => {
        const user_id = response.$id;
        const databases = new Databases(client);
        const promise = databases.listDocuments(
          ID.mainDBID,
          ID.bookStatusCollectionID,
          [Query.equal("user_id", user_id)],
        );

        promise.then(
          function (response) {
            const documents = response.documents;
            let readCount = 0;
            let currReadingCount = 0;
            let wantToReadCount = 0;
            let didNotFinishCount = 0;
            documents.forEach((doc) => {
              switch (doc.status) {
                case "READ":
                  readCount++;
                  break;
                case "CURRENTLY_READING":
                  currReadingCount++;
                  break;
                case "WANT_TO_READ":
                  wantToReadCount++;
                  break;
                case "DID_NOT_FINISH":
                  didNotFinishCount++;
                  break;
                default:
                  break;
              }
            });
            setBooksReadCount(readCount);
            setBooksCurrReadingCount(currReadingCount);
            setBooksWantToReadCount(wantToReadCount);
            setBooksDidNotFinishCount(didNotFinishCount);
          },
          function (error) {
            console.log(error);
          },
        );
      })
      .catch((error) => {
        console.error("Error fetching user ID:", error);
      });
  }, []);

  function signOut() {
    (async () => {
      await account.deleteSessions();
    })();
    setLoggedIn(false);
  }

  return (
    <ProfileContext.Provider value={navigation}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          bounces={false}
          contentContainerStyle={styles.scrollViewStyle}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.userInfoRow}>
            <Text style={styles.userInfoText}>Username: {username}</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("UsernameEditing");
              }}
            >
              <MaterialIcons
                name="edit"
                size={22}
                color={Colors.BUTTON_PURPLE}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.userInfoRow}>
            <Text
              style={styles.userInfoText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              Email: {email}
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("EmailEditing");
              }}
            >
              <MaterialIcons
                name="edit"
                size={22}
                color={Colors.BUTTON_PURPLE}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.text}>Books read: {booksReadCount}</Text>
          <Text style={styles.text}>
            Books currently reading: {booksCurrReadingCount}
          </Text>
          <Text style={styles.text}>
            Books want to read: {booksWantToReadCount}
          </Text>
          <Text style={styles.text}>
            Books did not finish: {booksDidNotFinishCount}
          </Text>
          <Divider />

          <Button
            onPress={() => navigation.navigate("createCustomProperty")}
            color={Colors.BUTTON_PURPLE}
            containerStyle={{ borderRadius: 30 }}
          >
            <Text
              style={{
                color: "white",
                paddingRight: 5,
                fontSize: 17,
                paddingTop: 5,
                paddingBottom: 5,
                alignSelf: "center",
              }}
            >
              Create Custom Property
            </Text>
          </Button>

          <TouchableOpacity
            onPress={() => navigation.navigate("manageFriends")}
          >
            <View
              style={{
                flexDirection: "row",
                paddingTop: 12,
                paddingBottom: 12,
                width: "100%",
              }}
            >
              <Text style={{ fontSize: 20, paddingLeft: 20, flex: 9 }}>
                Manage Friends
              </Text>
              <View style={{ flex: 2 }}>
                <Icon name="people" color={Colors.BUTTON_PURPLE} size={30} />
              </View>
            </View>
          </TouchableOpacity>

          <Divider />
          <TouchableOpacity onPress={() => navigation.navigate("notifModal")}>
            <View
              style={{
                flexDirection: "row",
                paddingTop: 12,
                paddingBottom: 12,
                width: "100%",
              }}
            >
              <Text style={{ fontSize: 20, paddingLeft: 20, flex: 9 }}>
                Notifications
              </Text>
              <View style={{ flex: 2 }}>
                <Icon
                  name="notifications"
                  color={Colors.BUTTON_PURPLE}
                  size={30}
                />
              </View>
            </View>
          </TouchableOpacity>

          <Divider />

          <TouchableOpacity onPress={signOut}>
            <View
              style={{
                flexDirection: "row",
                paddingTop: 12,
                paddingBottom: 12,
                width: "100%",
              }}
            >
              <Text style={{ fontSize: 20, paddingLeft: 20, flex: 9 }}>
                Sign Out
              </Text>
              <View style={{ flex: 2 }}>
                <Icon name="logout" color={Colors.BUTTON_PURPLE} size={30} />
              </View>
            </View>
          </TouchableOpacity>

          <Divider />

          <View style={{ paddingTop: 20, alignItems: "center" }}>
            <Button
              onPress={toggleOverlay}
              color={"red"}
              containerStyle={{ borderRadius: 30 }}
            >
              <Text
                style={{
                  color: "white",
                  paddingRight: 5,
                  fontSize: 17,
                  paddingTop: 5,
                  paddingBottom: 5,
                  alignSelf: "center",
                }}
              >
                Delete Account
              </Text>
            </Button>
          </View>
          <View style={{ height: 50 }}>
            <Overlay isVisible={overlayVisible} onBackdropPress={toggleOverlay}>
              <Text style={{ fontSize: 30 }}>Delete account placeholder</Text>
            </Overlay>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ProfileContext.Provider>
  );
}

function ActivityTab({}) {
  return (
    <View style={{ flex: 1 }}>
      {/* <BookInfoModalReview bookInfo={bookInfo} /> */}
    </View>
  );
}

function StatisticsTab() {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        bounces={false}
        contentContainerStyle={styles.scrollViewStyle}
      >
        <TouchableOpacity activeOpacity={1}>
          <Text style={{ margin: 10 }}>Text Statistics:</Text>
          <Text style={{ margin: 10 }}>Graph Statistics:</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function ProfileTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ animationEnabled: false }}
      tabBar={(props) => <MyTabBar {...props} />}
      sceneContainerStyle={{ backgroundColor: "transparent" }}
    >
      <Tab.Screen name="Profile" children={(props) => <ProfileTab />} />
      <Tab.Screen name="Activity" children={(props) => <ActivityTab />} />
      <Tab.Screen name="Statistics" component={StatisticsTab} />
    </Tab.Navigator>
  );
}

export default ProfileTabs;

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
