import React from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from "react-native";

import BookSearchBar from "@/Components/BookSearchBar";
import { Divider } from "react-native-paper";
import { DATA } from "@/Components/BookSearchBar/Genres";
import { Databases, Query } from "appwrite";
import { debounce } from "lodash";

import { client } from "@/appwrite";
import ID from "@/Constants/ID";
import { BACKEND_API_BOOK_SEARCH_URL } from "@/Constants/URLs";

import { NavigationContext } from "../Contexts";
import { SafeAreaView } from "react-native-safe-area-context";
import ErrorModal from "@/Components/ErrorModal";

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
  let book_documents;
  try {
    const res = await fetch(
      `${BACKEND_API_BOOK_SEARCH_URL}?` + new URLSearchParams({ title: param }),
    );
    book_documents = (await res.json()).results.documents;
  } catch (error: any) {
    console.error(error);
    clearTimeout(timeout);
    setLoading(false);
  }

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
            author: author.name,
            summary: book.description,
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

function SearchScreen(props) {
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
          setErrorMessage("An error occurred while searching for the books.");
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
      <SafeAreaView style={{ flexGrow: 1, backgroundColor: "white" }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View testID="search-screen-view">
            <Text
              style={{
                marginLeft: 20,
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
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{height: '100%'}}>
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
        </KeyboardAvoidingView>
      </SafeAreaView>
      <ErrorModal
        message={errorMessage}
        visible={errorModalVisible}
        setVisible={setErrorModalVisible}
      />
    </NavigationContext.Provider>
  );
}

export default SearchScreen;
