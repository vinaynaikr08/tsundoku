import React from "react";
import NavBar from "./NavBar/NavBar";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StarRating from "../Components/StarRating/StarRating";
import TextReview from "../Components/TextReview/TextReview";
import BookInfoModal from "../Components/BookInfoModal/BookInfoModal";
import ShelfModal from "../Components/ShelfModal/ShelfModal";
import Review from "../Components/Review/Review";

const Stack = createNativeStackNavigator();

function AppNavigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="navbar" component={NavBar} />
      <Stack.Group
        screenOptions={{
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      >
        <Stack.Screen name="review" component={Review} />
        <Stack.Screen name="bookInfoModal" component={BookInfoModal} />
        <Stack.Screen name="shelfModal" component={ShelfModal} />
      </Stack.Group>
      <Stack.Screen
        name="textReviewModal"
        component={TextReview}
        options={{
          presentation: "modal",
          gestureDirection: "horizontal",
        }}
      />
    </Stack.Navigator>
  );
}
export default AppNavigation;
