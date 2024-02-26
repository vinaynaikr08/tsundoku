import React, { useState } from "react";
import { View, Text, Platform, Image, FlatList, TouchableWithoutFeedback, Keyboard, KeyboardEvent, Dimensions, KeyboardAvoidingView } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";


import { BACKEND_API_BOOK_SEARCH_URL } from "../Constants/URLs";
import CarouselTabs from "../Components/DiscoverCarouselTabs/DiscoverCarouselTabs";
import { NavigationContext } from "../Contexts";
import { SafeAreaView } from "react-native-safe-area-context";
import BookSearchBar from "@/Components/BookSearchBar";
import { Divider } from "react-native-paper";

const Stack = createStackNavigator();

export const Discover = (props) => {
  const windowHeight = Dimensions.get('window').height; 
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState([]);

  async function getBooks(title) {
    setLoading(true);
    let res = await fetch(
      `${BACKEND_API_BOOK_SEARCH_URL}?` +
        new URLSearchParams({
          title: title,
        }),
    );

    const res_json = await res.json();
    return res_json.results.documents.map((book) => {
      return {
        id: book.$id,
        title: book.title,
        author: book.authors[0].name,
        image_url: book.editions[0].thumbnail_url,
        isbn_10: book.editions[0].isbn_10,
        isbn_13: book.editions[0].isbn_13,
      };
    });
  }

  const { navigation } = props;
  const [search, setSearch] = useState("");
  const updateSearch = (search) => {
    setSearch(search);
    getBooks(search).then((data) => {
      setBooks(data);
    });
    setLoading(false);
  };

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
          <BookSearchBar search={search} updateSearch={updateSearch} newPlaceholder={"Search all books"} loading={loading} showFilter={true} />
        </View>
        <CarouselTabs navigation={navigation} />
        
        {search.length > 0 && 
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ backgroundColor: '#F7F7F7', width: '100%', position: "absolute", top: '21.5%', zIndex: 100, borderColor: 'black', borderWidth: 0, maxHeight: windowHeight - 230}}>
          <FlatList data={books} style={{flexGrow: 0}} 
            renderItem={({item}) => {
              return (
                <View>
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
                    <View style={{ paddingLeft: 10, width: "90%" }}>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: 20, flexShrink: 1}}>{item.title}</Text>
                      </View>
                      <Text>{item.author}</Text>
                      <Text >ISBN: {item.isbn_13}</Text>
                    </View>
                  </View>
                  <Divider style={{backgroundColor: "black"}}/>
                </View>
              )
              
            } 
          }/>
        </KeyboardAvoidingView>}
      </SafeAreaView>
    </NavigationContext.Provider>
  );
};
