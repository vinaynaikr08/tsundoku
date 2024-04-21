import { BookInfoWrapperContext } from "@/Contexts";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { BookInfoModal } from "../BookInfoModal";
import FullReview from "../FullReview/FullReview";
import EditPrivateNotes from "../EditPrivateNotes/EditPrivateNotes";

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
          <Stack.Screen name="EditPrivateNotes" component={EditPrivateNotes} />
        </Stack.Group>
      </Stack.Navigator>
    </BookInfoWrapperContext.Provider>
  );
}

export default BookInfoWrapper;
