import React, { useState } from "react";
import { View, Text, Platform, Image, FlatList, TouchableWithoutFeedback, Keyboard, KeyboardEvent, Dimensions, KeyboardAvoidingView } from "react-native";
import Carousel from "../Components/Carousel/Carousel";
import CarouselTabs from "../Components/DiscoverCarouselTabs/DiscoverCarouselTabs";
import StarRating from "../Components/StarRating/StarRating";
import { createStackNavigator } from "@react-navigation/stack";
import TextReview from "../Components/TextReview/TextReview";
import { useNavigation } from "@react-navigation/native";
import { createContext, useContext } from "react";

import { BACKEND_API_BOOK_SEARCH_URL } from "../Constants/URLs";
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
      };
    });
  }

  const { navigation } = props;
  const [isReviewModalVisible, setReviewModalVisible] = useState(false);
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
                    <View
                      style={{
                        paddingLeft: 10,
                      }}
                    >
                      <Text style={{ fontSize: 20 }}>{item.title}</Text>
                      <Text>{item.author}</Text>
                      <Text>ISBN: temp</Text>
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
