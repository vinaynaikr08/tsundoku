import Backend from "@/Backend";
import { favoriteGenre } from "@/Components/WrappedBasics/FavoriteGenre";
import { genrePieChart } from "@/Components/WrappedBasics/GenrePieChart";
import { pagesRead } from "@/Components/WrappedBasics/PagesRead";
import { Icon } from "@rneui/base";
import React from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import useSWR from "swr";
import { intro } from "../Components/WrappedBasics/Intro";

const backend = new Backend();

function getData() {
  const { data } = useSWR({ status: "READ" }, backend.getBooksOfStatusFromDate);
  return data;
}

export const WrappedScreen = (props) => {
  const { navigation } = props;
  const { width, height } = Dimensions.get("screen");
  const data = getData();
  const items = [
    {
      name: "number1",
      screen: intro(),
      index: 1,
    },
    {
      name: "number2",
      screen: pagesRead(data),
      index: 2,
    },
    {
      name: "number3",
      screen: favoriteGenre(data),
      index: 3,
    },
    {
      name: "number4",
      screen: genrePieChart(data),
      index: 4,
    },
  ];
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const handleOnScroll = (event) => {
    Animated.event(
      [
        {
          nativeEvent: {
            contentOffset: {
              x: scrollX,
            },
          },
        },
      ],
      {
        useNativeDriver: false,
      },
    )(event);
  };
  return (
    <View style={{ height: height }}>
      {data === undefined ? (
        <SafeAreaView style={{ height: height, backgroundColor: "#CBC3E3", width: width, alignItems: 'center', justifyContent: "center" }}>
          <Text style={{fontSize: 25, paddingBottom: 10}}>Loading Wrapped...</Text>
          <ActivityIndicator />
        </SafeAreaView>
      ) : (
        <View>
          <FlatList
            data={items}
            renderItem={({ item }) => (
              <View
                style={{
                  backgroundColor: "#CBC3E3",
                  width: width,
                  alignItems: "center",
                }}
              >
                {item.screen}
              </View>
            )}
            horizontal
            pagingEnabled
            snapToAlignment="center"
            showsHorizontalScrollIndicator={false}
            onScroll={handleOnScroll}
          />
          <SafeAreaView
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              bottom: 25,
            }}
          >
            {items.map((item) => {
              const inputRange = [
                (item.index - 2) * width,
                (item.index - 1) * width,
                item.index * width,
              ];
              const dotWidth = scrollX.interpolate({
                inputRange,
                outputRange: [12, 30, 12],
                extrapolate: "clamp",
              });
              return (
                <Animated.View
                  key={item.index}
                  style={[
                    {
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: "black",
                      marginHorizontal: 3,
                    },
                    { width: dotWidth },
                  ]}
                />
              );
            })}
          </SafeAreaView>
        </View>
      )}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ height: "10%", position: "absolute", right: 15 }}
      >
        <SafeAreaView>
          <Icon name="close" color="red" size={30} />
        </SafeAreaView>
      </TouchableOpacity>
    </View>
  );
};
