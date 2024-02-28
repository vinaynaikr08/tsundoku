import React, { useState } from "react";
import { View, Text, Platform, Image, FlatList, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Dimensions, KeyboardAvoidingView, Pressable } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";


import { BACKEND_API_BOOK_SEARCH_URL, BACKEND_API_AUTHOR_SEARCH_URL } from "../Constants/URLs";
import CarouselTabs from "../Components/DiscoverCarouselTabs/DiscoverCarouselTabs";
import { NavigationContext } from "../Contexts";
import { SafeAreaView } from "react-native-safe-area-context";
import BookSearchBar from "@/Components/BookSearchBar";
import { Divider } from "react-native-paper";
import { DATA } from "@/Components/BookSearchBar/Genres";

const Stack = createStackNavigator();

export const Discover = (props) => {
  const windowHeight = Dimensions.get('window').height; 
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [search, setSearch] = useState("");
  const GENRES = DATA();

  React.useEffect(() => {
    async function getBooks(param) {
      setLoading(true);
      let res = await fetch(
        `${BACKEND_API_BOOK_SEARCH_URL}?` +
          new URLSearchParams({
            title: param,
          }),
      );
      const res_json = await res.json();
      return await res_json.results.documents.map((book) => {
        return {
          id: book.$id,
          title: book.title,
          author: book.authors[0].name,
          image_url: book.editions[0].thumbnail_url,
          isbn_10: book.editions[0].isbn_10,
          isbn_13: book.editions[0].isbn_13,
          genre: book.genre
        };
      });
    }

    async function getAuthors(param) {
      setLoading(true);
      let res = await fetch(
        `${BACKEND_API_AUTHOR_SEARCH_URL}?` +
          new URLSearchParams({
            name: param,
          }),
      );
      const res_json = await res.json();
      return await res_json.results.documents.map((author) => {
        return {
          books: author.books,
        };
      });
    }

    getBooks(search).then((data) => {
      setBooks(data);
    }).catch((error: TypeError) => {
    }).catch(error => {
      console.log('books: ' + error)
    });

    getAuthors(search).then(data => {
      setAuthors(data);
    }).catch((error: TypeError) => {
    }).catch(error => {
      console.log('authors: ' + error)
    });

    setLoading(false);
  }, [search]);

  const { navigation } = props;
  const updateSearch = (search) => {
    setSearch(search);
  };


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
          return (genre.state[0]);
        }
        else if (value == genre.title[1]) {
          return (genre.state[1]);
        }
      }
    }
  }


  return (
    <NavigationContext.Provider value={navigation}>
      <SafeAreaView style={{ flexGrow: 1, backgroundColor: "white" }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false} >
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
        <View style={{paddingLeft: 10, paddingBottom: 10, paddingRight: 10}}>
          <BookSearchBar search={search} updateSearch={updateSearch} newPlaceholder={"Search all books"} loading={loading} showFilter={true} GENRES={GENRES} />
        </View>
        <CarouselTabs navigation={navigation} />
        
        {search.length > 0 && 
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ backgroundColor: '#F7F7F7', width: '100%', position: "absolute", top: '21.5%', zIndex: 100, borderColor: 'black', borderWidth: 0, maxHeight: windowHeight - 230}}>
          <FlatList data={books.filter(book => checkGenres(book.genre))}
            style={{flexGrow: 0}} 
            renderItem={({item}) => {
              return (
                <TouchableOpacity onPress={() =>
                  navigation.navigate("bookInfoModal", { bookInfo: item })
                }>
                  <View style={{flexDirection: 'row', paddingTop: 10, paddingBottom: 10}}>
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
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: 20, flexShrink: 1}}>{item.title}</Text>
                      </View>
                      <Text>{item.author}</Text>
                      <Text >ISBN: {item.isbn_13}</Text>
                    </View>
                  </View>
                  <Divider style={{backgroundColor: "black"}}/>
                </TouchableOpacity>
              )
              
            } 
          }/>

        </KeyboardAvoidingView>}
      </SafeAreaView>
    </NavigationContext.Provider>
  );
};
