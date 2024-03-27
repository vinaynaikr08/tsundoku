import { NavigationContext } from "@/Contexts";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { Icon, SearchBar } from "@rneui/base";
import ErrorModal from "@/Components/ErrorModal";
import { Divider } from "react-native-paper";

import { client } from "@/appwrite";
import { Databases } from "appwrite";
import ID from "@/Constants/ID";
const databases = new Databases(client);

const fakeData = [
  { username: "kaley", user_id: 1 },
  { username: "sarah", user_id: 2 },
  { username: "sam", user_id: 3 },
];

function UserSearchScreen({ navigation }) {
  const [errorModalVisible, setErrorModalVisible] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = React.useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function getUsers() {
      const promise = await databases.listDocuments(
        ID.mainDBID,
        ID.userDataCollectionID,
      );

      return promise.documents.map((user) => {
        return {
          user_id: user.user_id,
          username: user.username,
        };
      });
    }

    getUsers()
      .then((data) => {
        console.log("data: " + data);
        setUsers(data);
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage("An error occurred fetching users.");
        setErrorModalVisible(true);
      });
  }, []);

  return (
    <NavigationContext.Provider value={navigation}>
      <SafeAreaView style={{ flexGrow: 1, backgroundColor: "white" }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View
            testID="search-screen-view"
            style={{ flexDirection: "row", width: "100%" }}
          >
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <View
                style={{ marginTop: 5, flexDirection: "row", marginLeft: 20 }}
              >
                <Icon name="arrow-back-ios" />
              </View>
            </TouchableOpacity>
            <Text
              style={{
                marginLeft: 0,
                marginBottom: 15,
                marginTop: 5,
                fontWeight: "700",
                fontSize: 21,
              }}
            >
              Search Users
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <View style={{ paddingLeft: 10, paddingBottom: 10, paddingRight: 10 }}>
          <SearchBar
            autoFocus={true}
            placeholder={"Search users"}
            lightTheme
            showLoading={loading}
            round
            onChangeText={(value) => setSearch(value)}
            value={search}
            autoCorrect={false}
            containerStyle={styles.searchBarContainer}
            inputContainerStyle={styles.inputContainer}
          />
        </View>
        <View style={{ height: "89%" }}>
          {search.length > 0 && <FlatList
            data={users.filter((obj) => obj.username.includes(search))}
            style={{ flexGrow: 0 }}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("UserProfileScreen", {
                      username: item.username,
                      user_id: item.user_id,
                    })
                  }
                >
                  <View
                    style={{
                      flexDirection: "row",
                      paddingTop: 10,
                      paddingBottom: 10,
                    }}
                  >
                    <View style={{ paddingLeft: 20, width: "80%" }}>
                      <View style={{ flexDirection: "row" }}>
                        <Text style={{ fontSize: 20, flexShrink: 1 }}>
                          {item.username}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Divider
                    style={{ backgroundColor: "black" }}
                    horizontalInset
                  />
                </TouchableOpacity>
              );
            }}
          />}
        </View>
      </SafeAreaView>
      <ErrorModal
        message={errorMessage}
        visible={errorModalVisible}
        setVisible={setErrorModalVisible}
      />
    </NavigationContext.Provider>
  );
}

export default UserSearchScreen;

const styles = StyleSheet.create({
  searchBarView: {
    backgroundColor: "white",
    flexDirection: "row",
  },
  searchBarContainer: {
    padding: 0,
    backgroundColor: "transparent",
    borderBottomColor: "transparent",
    borderTopColor: "transparent",
  },
  inputContainer: {
    borderRadius: 20,
    backgroundColor: "#F7F7F7",
  },
  filterButton: {
    flex: 2,
    alignItems: "center",
  },
  filterOverlay: {
    backgroundColor: "white",
    width: "89%",
    height: "70%",
    borderRadius: 20,
    marginTop: 60,
  },
  filterText: {
    marginLeft: 0,
    marginTop: 5,
    marginBottom: 5,
    fontWeight: "bold",
    fontSize: 20,
    alignSelf: "center",
  },
  checkboxContainer: {
    paddingLeft: 0,
    paddingTop: 0,
  },
  checkboxText: {
    fontWeight: "normal",
    fontSize: 17,
    marginLeft: 7,
  },
  clearAllButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    borderRadius: 20,
  },
});
