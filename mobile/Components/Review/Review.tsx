import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TextReview from "../TextReview/TextReview";
import StarRating from "../StarRating/StarRating";

const Stack = createNativeStackNavigator();

function Review() {
  return (
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
  );
}
export default Review;
