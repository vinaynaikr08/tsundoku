import { BookInfoContext } from "@/Contexts";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import CustomPropertyReview from "../CustomPropertyReview/CustomPropertyReview";
import StarRating from "../StarRating/StarRating";
import TextReview from "../TextReview/TextReview";

const Stack = createStackNavigator();

function Review({ route }) {
  const { bookInfo } = route.params;
  return (
    <BookInfoContext.Provider value={bookInfo}>
      <Stack.Navigator>
        <Stack.Group
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="starRatingModal" component={StarRating} />
          <Stack.Screen
            name="customPropertyModal"
            component={CustomPropertyReview}
          />
          <Stack.Screen name="textReviewModal" component={TextReview} />
        </Stack.Group>
      </Stack.Navigator>
    </BookInfoContext.Provider>
  );
}
export default Review;
