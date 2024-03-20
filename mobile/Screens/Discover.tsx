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

import CarouselTabs from "../Components/DiscoverCarouselTabs/DiscoverCarouselTabs";
import { NavigationContext } from "../Contexts";
import { SafeAreaView } from "react-native-safe-area-context";
import BookSearchBar from "@/Components/BookSearchBar";
import { Divider } from "react-native-paper";
import { DATA } from "@/Components/BookSearchBar/Genres";
import { Databases, Query } from "appwrite";
import { debounce } from "lodash";

import { client } from "@/appwrite";
import ID from "@/Constants/ID";
import { BACKEND_API_BOOK_SEARCH_URL } from "@/Constants/URLs";

const databases = new Databases(client);

async function getBooks(
  param,
  setErrorMessage,
  setErrorModalVisible,
  setLoading,
) {
  let books = [];

  //set timeout function for errors
  const timeout = setTimeout(() => {
    setErrorMessage("Book request timed out.");
    setErrorModalVisible(true);
  }, 10000);

  // Search by books
  const res = await fetch(
    `${BACKEND_API_BOOK_SEARCH_URL}?` + new URLSearchParams({ title: param }),
  );
  const book_documents = (await res.json()).results.documents;

  for (const book of book_documents) {
    if (books.filter((e) => e.id === book.$id).length === 0) {
      books = [
        ...books,
        {
          id: book.$id,
          title: book.title,
          author: book.authors[0].name,
          summary: book.description,
          image_url: book.editions[0].thumbnail_url,
          isbn_10: book.editions[0].isbn_10,
          isbn_13: book.editions[0].isbn_13,
          genre: book.genre,
        },
      ];
    }
  }

  // Search by author
  const author_documents = (
    await databases.listDocuments(ID.mainDBID, ID.authorCollectionID, [
      Query.search("name", param),
    ])
  ).documents;

  for (const author of author_documents) {
    for (const book of author.books) {
      if (books.filter((e) => e.id === book.$id).length === 0) {
        books = [
          ...books,
          {
            id: book.$id,
            title: book.title,
            summary: book.description,
            author: author.name,
            image_url: book.editions[0].thumbnail_url,
            isbn_10: book.editions[0].isbn_10,
            isbn_13: book.editions[0].isbn_13,
            genre: book.genre,
          },
        ];
      }
    }

    // Search by ISBN_13 and ISBN_10
    const edition_documents = (
      await databases.listDocuments(ID.mainDBID, ID.editionCollectionID, [
        Query.search("isbn_13", param),
        Query.search("isbn_10", param),
      ])
    ).documents;

    for (const edition of edition_documents) {
      for (const book of edition.books) {
        if (books.filter((e) => e.id === book.$id).length === 0) {
          books = [
            ...books,
            {
              id: book.$id,
              title: book.title,
              author: author.name,
              summary: book.description,
              image_url: edition.thumbnail_url,
              isbn_10: edition.isbn_10,
              isbn_13: edition.isbn_13,
              genre: book.genre,
            },
          ];
        }
      }
    }
  }

  clearTimeout(timeout);
  setLoading(false);

  return books;
}

const windowHeight = Dimensions.get("window").height;

export const Discover = (props) => {
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
      getBooks(query, setErrorMessage, setErrorModalVisible, setLoading)
        .then((books) => setBooks(books))
        .catch((error: any) => {
          console.error(error);
          setErrorMessage("There was an error fetching books from the server.");
          setErrorModalVisible(true);
        });
    } else {
      setBooks([]);
      setLoading(false);
    }
  }

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
      <SafeAreaView style={styles.safeArea}>
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
              Discover
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.bookSearchContainer}>
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
        <View>
          <Image source={require("../assets/wrapped-banner.png")} style={{width: '100%', height: 150}} />
          <View style={{position: 'absolute', top: "15%", width: 300, justifyContent: 'center', alignSelf: 'center',}}>
            <Text style={{color: 'white', fontSize: 20, textAlign: 'center', fontWeight: '500'}}>
              Your [insert year] Tsundoku Wrapped is here!
            </Text>
            <TouchableOpacity style={{backgroundColor: 'white', padding: 0, margin: 0, height: 36, width: '36%', top: 10, justifyContent: 'center', alignSelf: 'center', borderRadius: 15}}>
              <Text style={{textAlign: 'center', color: '#5E3FC5', fontSize: 15}}>Open</Text>
            </TouchableOpacity>
          </View>
        </View>
        <CarouselTabs />

        {search.length > 0 && (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.searchResultContainer}
          >
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
                    <View style={styles.resultItemContainer}>
                      <Image
                        style={styles.image}
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
          </KeyboardAvoidingView>
        )}
      </SafeAreaView>
      <Modal
        // animationType="slide"
        transparent={true}
        visible={errorModalVisible}
        onRequestClose={() => setErrorModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{errorMessage}</Text>
            <Pressable onPress={() => setErrorModalVisible(false)}>
              <Text style={styles.modalButton}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </NavigationContext.Provider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flexGrow: 1, 
    backgroundColor: "white",
  },
  bookSearchContainer: {
    paddingLeft: 10, 
    paddingBottom: 10, 
    paddingRight: 10,
  },
  searchResultContainer: {
    backgroundColor: "#F7F7F7",
    width: "100%",
    position: "absolute",
    top: "21.5%",
    zIndex: 100,
    borderColor: "black",
    borderWidth: 0,
    maxHeight: windowHeight - 230,
  },
  resultItemContainer: {
    flexDirection: "row",
    paddingTop: 10,
    paddingBottom: 10,
  },
  image: {
    width: 80,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    shadowColor: "black",
  },
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
