import React from "react";
import {
  FlatList,
  Image,
  Keyboard,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import BookSearchBar from "@/Components/BookSearchBar";
import { DATA } from "@/Components/BookSearchBar/Genres";
import { debounce } from "lodash";
import { Divider } from "react-native-paper";

import Backend from "@/Backend";
import ErrorModal from "@/Components/ErrorModal";
import { Icon } from "@rneui/base";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationContext } from "../Contexts";

const backend = new Backend();

function BookSearchScreen(props) {
  const [loading, setLoading] = React.useState(false);
  const [books, setBooks] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const GENRES = DATA();
  const [errorModalVisible, setErrorModalVisible] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const performDebouncedSearch = React.useCallback(
    debounce(performSearch, 1000),
    [],
  );

  function performSearch(query) {
    if (query.length > 0) {
      setLoading(true);

      // Set timeout function for errors
      const timeout = setTimeout(() => {
        setErrorMessage("Book request timed out.");
        setErrorModalVisible(true);
      }, 10000);

      backend
        .totalSearch(query)
        .then((books) => {
          setBooks(books);
        })
        .catch((error: any) => {
          console.error(error);
          setErrorMessage("An error occurred while searching for the books.");
          setErrorModalVisible(true);
        })
        .finally(() => {
          clearTimeout(timeout);
          setLoading(false);
        });
    } else {
      setBooks([]);
      setLoading(false);
    }
  }

  const { navigation } = props;

  function checkGenres(value) {
    let noFilter = true;

    for (const genre of GENRES) {
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
      for (const genre of GENRES) {
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
              Search
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <View style={{ paddingLeft: 10, paddingBottom: 10, paddingRight: 10 }}>
          <BookSearchBar
            search={search}
            updateSearch={(val) => {
              setLoading(true);
              setSearch(val);
              performDebouncedSearch(val);
            }}
            newPlaceholder={"Search all books"}
            loading={loading}
            showFilter={true}
            GENRES={GENRES}
          />
        </View>
        <View style={{ height: "89%" }}>
          <FlatList
            data={books.filter((book) => checkGenres(book.genre))}
            style={{ flexGrow: 0 }}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("bookInfoModal", { bookInfo: item })
                  }
                >
                  <View
                    style={{
                      flexDirection: "row",
                      paddingTop: 10,
                      paddingBottom: 10,
                    }}
                  >
                    <Image
                      style={{
                        width: 80,
                        height: 100,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "white",
                        shadowColor: "black",
                      }}
                      resizeMode="contain"
                      source={{ uri: item.image_url }}
                    />
                    <View style={{ paddingLeft: 10, width: "80%" }}>
                      <View style={{ flexDirection: "row" }}>
                        <Text style={{ fontSize: 20, flexShrink: 1 }}>
                          {item.title}
                        </Text>
                      </View>
                      <Text>{item.author}</Text>
                      <Text>ISBN: {item.isbn_13}</Text>
                    </View>
                  </View>
                  <Divider style={{ backgroundColor: "black" }} />
                </TouchableOpacity>
              );
            }}
          />
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

export default BookSearchScreen;
