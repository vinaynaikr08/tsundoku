import React, { useContext, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Colors from "../../Constants/Colors";

import { NavigationContext } from "../../Contexts";

export const Carousel = ({ books, shelf }) => {
  const navigation = useContext(NavigationContext);
  const pan = useRef(new Animated.ValueXY()).current;

  const [scrollViewWidth, setScrollViewWidth] = useState(0);

  const boxWidth = scrollViewWidth * 0.6;
  const boxDistance = scrollViewWidth - boxWidth;
  const halfBoxDistance = boxDistance / 2;
  const snapWidth = boxWidth;

  return (
    <View style={styles.container}>
      <View>
        {books.length == 0 && (
          <Text style={styles.noBooksText}>No books in this shelf</Text>
        )}
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
                {/* <View style={{ width: boxWidth, backgroundColor: "green"}}> */}
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("bookInfoModal", { bookInfo: item })
                  }
                >
                  <Image
                    style={{
                      marginVertical: 10,
                      width: boxWidth,
                      height: 300,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 15,
                      backgroundColor: "white",
                      shadowColor: "black",
                      shadowOffset: {
                        width: 3,
                        height: 4,
                      },
                      shadowOpacity: 0.15,
                      shadowRadius: 5,
                    }}
                    resizeMode="contain"
                    source={{ uri: item.image_url }}
                  />
                </TouchableOpacity>
              </Animated.View>
            );
          }}
        />
        {books.length > 0 && (
          <View
            style={{
              backgroundColor: "white",
              alignSelf: "center",
            }}
          >
            <Pressable
              onPress={() =>
                navigation.navigate("shelfModal", {
                  bookData: books,
                  shelf: shelf,
                })
              }
              style={{ backgroundColor: Colors.BUTTON_GRAY, padding: 10 }}
            >
              <Text>View All</Text>
            </Pressable>
          </View>
        )}
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
    flex: 1,
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
    height: "90%",
  },
  noBooksText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    margin: 10,
  },
});

export default Carousel;
