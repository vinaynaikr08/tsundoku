import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TextReview from "../TextReview/TextReview";
import StarRating from "../StarRating/StarRating";
import { BookInfoContext } from "@/Contexts";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

function Review({route}) {
  const {bookInfo} = route.params;
  console.log("review provider: " + bookInfo.id)
  return (
    <BookInfoContext.Provider value={bookInfo.id}>
    <Stack.Navigator>
      <Stack.Group
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="starRatingModal" component={StarRating} />
        <Stack.Screen name="textReviewModal" component={TextReview} />
      </Stack.Group>
    </Stack.Navigator>
    </BookInfoContext.Provider>
  );
}
export default Review;
