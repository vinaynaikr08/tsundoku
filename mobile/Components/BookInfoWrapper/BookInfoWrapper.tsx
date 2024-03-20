import { BookInfoWrapperContext } from "@/Contexts";
import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { BookInfoModal } from "../BookInfoModal";
import FullReview from "../FullReview/FullReview";

const Stack = createStackNavigator();

function BookInfoWrapper({ route }) {
  const { bookInfo } = route.params;
  return (
    <BookInfoWrapperContext.Provider value={bookInfo}>
      <Stack.Navigator>
        <Stack.Group
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="bookInfoMain" component={BookInfoModal} />
          <Stack.Screen name="bookInfoFullReview" component={FullReview} />
        </Stack.Group>
      </Stack.Navigator>
    </BookInfoWrapperContext.Provider>
  );
}

export default BookInfoWrapper;
