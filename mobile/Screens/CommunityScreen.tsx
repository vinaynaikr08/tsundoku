import React from "react";
import {
  View,
  Text,
  Platform,
  Image,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  StyleSheet,
} from "react-native";

import BookSearchBar from "@/Components/BookSearchBar";
import { Divider } from "react-native-paper";
import { DATA } from "@/Components/BookSearchBar/Genres";
import { Databases, Query } from "appwrite";
import { debounce } from "lodash";

import { client } from "@/appwrite";
import ID from "@/Constants/ID";
import { BACKEND_API_BOOK_SEARCH_URL } from "@/Constants/URLs";
import CommunityTabs from "../Components/CommunityTabs/CommunityTabs";

import { NavigationContext } from "../Contexts";
import { SafeAreaView } from "react-native-safe-area-context";

const databases = new Databases(client);

export const Community = (props) => {
  const windowHeight = Dimensions.get("window").height;
  const [loading, setLoading] = React.useState(false);
  const [books, setBooks] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const GENRES = DATA();
  const [errorModalVisible, setErrorModalVisible] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const { navigation } = props;

  function checkGenres(value) {
    let noFilter: boolean = true;

    for (let genre of GENRES) {
      if (genre.state[0] == true) {
        noFilter = false;
      }
      if (genre.state[1] == true) {
        noFilter = false;
      }
    }
    if (noFilter) {
      return true;
    } else {
      for (let genre of GENRES) {
        if (value == genre.title[0]) {
          return genre.state[0];
        } else if (value == genre.title[1]) {
          return genre.state[1];
        }
      }
    }
  }

  return (
    <NavigationContext.Provider value={navigation}>
      <SafeAreaView style={{ flexGrow: 1, backgroundColor: "white" }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View>
            <Text
              style={{
                marginLeft: 20,
                marginBottom: 15,
                marginTop: 5,
                fontWeight: "700",
                fontSize: 21,
              }}
            >
              Community
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <CommunityTabs />
      </SafeAreaView>
    </NavigationContext.Provider>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButton: {
    fontSize: 16,
    color: "blue",
    textAlign: "center",
  },
});
