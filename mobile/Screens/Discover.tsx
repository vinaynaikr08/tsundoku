import React, { useState } from "react";
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
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

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

const Stack = createStackNavigator();

async function getBooks(param) {
  let books = [];

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

  return books;
}

export const Discover = (props) => {
  const windowHeight = Dimensions.get("window").height;
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const GENRES = DATA();
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const performDebouncedSearch = React.useMemo(() => {
    return debounce(performSearch, 500);
  }, []);

  // Stop searching when screen is unmounted
  React.useEffect(() => {
    return () => {
      performDebouncedSearch.cancel();
    };
  });

  function performSearch() {
    if (search.length > 0) {
      getBooks(search)
        .then((books) => setBooks(books))
        .catch((error: any) => {
          if (error instanceof Error) {
            setErrorMessage(error.message);
            setErrorModalVisible(true);
          } else {
            throw error;
          }
        });
    }
    setLoading(false);
  }

  React.useEffect(() => {
    setLoading(true);
    performDebouncedSearch();
  }, [search]);

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
              Discover
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <View style={{ paddingLeft: 10, paddingBottom: 10, paddingRight: 10 }}>
          <BookSearchBar
            search={search}
            updateSearch={setSearch}
            newPlaceholder={"Search all books"}
            loading={loading}
            showFilter={true}
            GENRES={GENRES}
          />
        </View>
        <CarouselTabs navigation={navigation} />

        {search.length > 0 && (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{
              backgroundColor: "#F7F7F7",
              width: "100%",
              position: "absolute",
              top: "21.5%",
              zIndex: 100,
              borderColor: "black",
              borderWidth: 0,
              maxHeight: windowHeight - 230,
            }}
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
        )}
      </SafeAreaView>
    </NavigationContext.Provider>
  );
};
