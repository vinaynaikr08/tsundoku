import React, { useState } from "react";
import { View, Text, SafeAreaView, Pressable, Button } from "react-native";
import Carousel from "../Components/Carousel/Carousel";
import CarouselTabs from "../Components/CarouselTabs/CarouselTabs";
import StarRating from "../Components/StarRating/StarRating";
import { createStackNavigator } from "@react-navigation/stack";
import TextReview from "../Components/TextReview/TextReview";
import { useNavigation } from "@react-navigation/native";

const Stack = createStackNavigator();

export const Library = () => {
  const [isReviewModalVisible, setReviewModalVisible] = useState(false);
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flexGrow: 1, backgroundColor: "white" }}>
      <Text
        style={{
          marginLeft: 20,
          marginBottom: 15,
          marginTop: 5,
          fontWeight: "700",
          fontSize: 21,
        }}
      >
        Your Library
      </Text>
      <CarouselTabs />
      {/* <Pressable
          onPress={() => navigation.navigate("StarRating")}
          style={{ backgroundColor: 'gray', padding: 10 }}
        >
          <Text>Star Rating</Text>
        </Pressable> */}
    </SafeAreaView>
  );
};

// export const LibraryPage = () => {
//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="Library" component={Library} />
//       <Stack.Group screenOptions={{ presentation: "modal" }}>
//         <Stack.Screen name="StarRating" component={StarRating} />
//         <Stack.Screen name="TextReview" component={TextReview} />
//       </Stack.Group>
//     </Stack.Navigator>
//   );
// };

