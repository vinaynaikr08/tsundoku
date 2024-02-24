import {
  Animated,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
  Button,
  Pressable,
  Image,
  ImageBackground,
} from "react-native";
import React, { useContext } from "react";
import { useState, useEffect, useRef, useCallback } from "react";

import Colors from "../../Constants/Colors";
import ShelfModal from "../ShelfModal";
import { useNavigation } from "@react-navigation/native";

import { NavigationContext } from "../../Contexts";
import { BACKEND_API_AUTHOR_SEARCH_URL, BACKEND_API_BOOK_SEARCH_URL } from "../../Constants/URLs";

type bookInfo = {
  title: string;
  author: string;
  id: string;
  image_url: string;
};


const BookCard = (
  { title, author, id, image_url }: bookInfo,
  navigation: any,
) => (
  <Image style={styles.card} resizeMode="cover" source={{ uri: image_url }}/>
  // <View style={styles.card}>
  // </View>
);

export const Carousel = (props: any) => {
  const navigation = useContext(NavigationContext);
  const pan = useRef(new Animated.ValueXY()).current;

  const [scrollViewWidth, setScrollViewWidth] = useState(0);
  const [isShelfModalVisible, setShelfModalVisible] = useState(false);

  const boxWidth = scrollViewWidth * 0.6;
  const boxDistance = scrollViewWidth - boxWidth;
  const halfBoxDistance = boxDistance / 2;
  const snapWidth = boxWidth;

  // TODO: figure out better way of doing this
  const [books, setBooks] = useState(null);

  React.useEffect(() => {
    fetch(
      `${BACKEND_API_BOOK_SEARCH_URL}?` +
        new URLSearchParams({
          title: "The Poppy War"
        }),
    )
      .then(async (data) => {
        const data_json = await data.json();
        console.log(JSON.stringify(data_json))
        const parsed_books = data_json.results.documents.map((book) => {
          return {
            id: book.$id,
            title: book.title,
            author: book.authors[0].name,
            image_url: book.editions[0].thumbnail_url,
          };
        });
        setBooks(parsed_books);
        return parsed_books; // This is what will be resolved in the chain
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={books}
        contentInsetAdjustmentBehavior="never"
        snapToAlignment="center"
        decelerationRate="fast"
        snapToInterval={snapWidth}
        automaticallyAdjustContentInsets={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={1}
        contentInset={{
          left: halfBoxDistance,
          right: halfBoxDistance,
        }}
        contentOffset={{ x: halfBoxDistance * -1, y: 0 }}
        onLayout={(e) => {
          setScrollViewWidth(e.nativeEvent.layout.width);
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: pan.x } } }],
          {
            useNativeDriver: false,
          },
        )}
        keyExtractor={(item, index) => `${index}-${item}`}
        renderItem={(props) => {
          const { index, item } = props;

          return (
            <Animated.View
              style={{
                transform: [
                  {
                    scale: pan.x.interpolate({
                      inputRange: [
                        (index - 1) * snapWidth - halfBoxDistance,
                        index * snapWidth - halfBoxDistance,
                        (index + 1) * snapWidth - halfBoxDistance,
                      ],
                      outputRange: [0.8, 1, 0.8],
                      extrapolate: "clamp",
                    }),
                  },
                ],
              }}
            >
              <View style={{ width: boxWidth }}>
              <Image style={styles.card} resizeMode="cover" source={{ uri: item.image_url }}/>
                {/* <BookCard
                  title={item.title}
                  author={item.author}
                  id={item.id}
                  image_url={item.image_url}
                /> */}
              </View>
            </Animated.View>
          );
        }}
      />
      <View
        style={{
          backgroundColor: "white",
          alignSelf: "center",
        }}
      >
        <Pressable
          onPress={() => navigation.navigate("shelfModal")}
          style={{ backgroundColor: Colors.BUTTON_GRAY, padding: 10 }}
        >
          <Text>View All</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    width: "100%",
    height: "83%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    backgroundColor: "pink",
    shadowColor: "black",
    shadowOffset: {
      width: 3,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  container: {
    backgroundColor: "white",
  },
  title: {
    fontSize: 30,
    marginTop: 35,
    marginLeft: 15,
  },
  text: {
    margin: 30,
    fontSize: 16,
  },
  image: {
    //flex: 1,
    borderRadius: 15,
    width: "100%",
    height: "90%"
  },
});

export default Carousel;
