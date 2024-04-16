import Backend from "@/Backend";
import { favoriteGenre } from "@/Components/WrappedBasics/FavoriteGenre";
import { genrePieChart } from "@/Components/WrappedBasics/GenrePieChart";
import { pagesRead } from "@/Components/WrappedBasics/PagesRead";
import { summary } from "@/Components/WrappedBasics/Summary";
import { Icon } from "@rneui/base";
import React, {useRef, useState} from "react";
import * as MediaLibrary from 'expo-media-library';
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

function getData(year: number) {
  const { data } = useSWR({ user_id: undefined, year: year }, backend.getWrapped);
  return data;
}

export const WrappedScreen = ({ navigation, route }) => {
  const { year } = route.params;
  const { width, height } = Dimensions.get("screen");
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const imageRef:any = useRef();
  const [status, requestPermission] = MediaLibrary.usePermissions();
  if (status === null) {
    requestPermission().catch(e => console.log(e));
  }

  const data : { year: number; pages: any; genre_arr: any; } | undefined = getData(year);

  const items = [
    {
      name: "number1",
      screen: intro(year),
      index: 1,
    },
    {
      name: "number2",
      screen: data !== undefined && pagesRead(data.pages),
      index: 2,
    },
    {
      name: "number3",
      screen: data !== undefined && favoriteGenre(data.genre_arr),
      index: 3,
    },
    {
      name: "number4",
      screen: data !== undefined && genrePieChart(data.genre_arr),
      index: 4,
    },
    {
      name: "number5",
      screen: data !== undefined && summary(data, imageRef, isOverlayVisible, setOverlayVisible),
      index: 5,
    },
  ];
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const handleOnScroll = (event: any) => {
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
