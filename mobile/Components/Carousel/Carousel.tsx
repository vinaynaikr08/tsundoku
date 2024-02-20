import {
  Animated,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
  Button,
  Pressable,
} from "react-native";
import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";

import Colors from "../../Constants/Colors";
import ShelfModal from "../ShelfModal";

const books = [
  { id: "1", title: "The Poppy War", author: "R. F. Kuang" },
  { id: "2", title: "The Poppy War", author: "R. F. Kuang" },
  { id: "3", title: "The Poppy War", author: "R. F. Kuang" },
  { id: "4", title: "The Poppy War", author: "R. F. Kuang" },
  { id: "5", title: "The Poppy War", author: "R. F. Kuang" },
];

type bookInfo = {
  title: string;
  author: string;
  index: number;
};

const BookCard = ({ title, author, index }: bookInfo) => (
  <View style={styles.card}>
    <Text>{index}</Text>
    <Text style={styles.text}>{title}</Text>
    <Text style={styles.text}>{author}</Text>
  </View>
);

export const Carousel = ( {currentShelf} ) => {
  const pan = useRef(new Animated.ValueXY()).current;

  const [scrollViewWidth, setScrollViewWidth] = useState(0);
  const [isShelfModalVisible, setShelfModalVisible] = useState(false);

  const boxWidth = scrollViewWidth * 0.6;
  const boxDistance = scrollViewWidth - boxWidth;
  const halfBoxDistance = boxDistance / 2;
  const snapWidth = boxWidth;

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
                <BookCard
                  title={item.title}
                  author={item.author}
                  index={index}
                />
              </View>
            </Animated.View>
          );
        }}
      />
      <View
        style={{
          backgroundColor: "white",
          height: 40,
          width: "33%",
          alignSelf: "center",
        }}
      >
        <Pressable
          onPress={() => setShelfModalVisible(true)}
          style={{ backgroundColor: Colors.BUTTON_GRAY, padding: 10 }}
        >
          <Text>View All</Text>
        </Pressable>
      </View>
      <ShelfModal
        isShelfModalVisible={isShelfModalVisible}
        setShelfModalVisible={setShelfModalVisible}
        currentShelf={currentShelf}
        books={books}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingVertical: 70,
    marginVertical: 10,
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
});

export default Carousel;
