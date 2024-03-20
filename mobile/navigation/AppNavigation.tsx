import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import NavBar from "./NavBar/NavBar";
import { SignIn } from "../Screens/SignIn";
import { InitialLaunchScreen } from "../Screens/InitialLaunchScreen";
import TextReview from "../Components/TextReview/TextReview";
import BookInfoModal from "../Components/BookInfoModal/BookInfoModal";
import ShelfModal from "../Components/ShelfModal/ShelfModal";
import NotificationsModal from "../Components/Notifications/NotificationsModal";
import ManageFriendsModal from "@/Components/ManageFriends/ManageFriendsModal";
import Review from "../Components/Review/Review";
import { LoginStateContext } from "@/Providers/LoginStateProvider";
import UsernameEditing from "@/Components/UsernameEditing";
import { Profile } from "@/Screens/ProfileScreen";
import EmailEditing from "@/Components/EmailEditing";
import CreateCustomProperty from "@/Components/CreateCustomProperty/CreateCustomProperty";

const Stack = createNativeStackNavigator();

function AppNavigation() {
  const { loggedIn } = React.useContext(LoginStateContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!loggedIn ? (
        <>
          <Stack.Screen name="initial_launch" component={InitialLaunchScreen} />
          <Stack.Screen name="sign_in" component={SignIn} />
        </>
      ) : (
        <>
          <Stack.Screen name="navbar" component={NavBar} />
          <Stack.Group
            screenOptions={{
              presentation: "modal",
              animation: "slide_from_bottom",
            }}
          >
            <Stack.Screen
              name="review"
              options={{ gestureEnabled: false }}
              component={Review}
            />
            <Stack.Screen name="bookInfoModal" component={BookInfoModal} />
            <Stack.Screen name="shelfModal" component={ShelfModal} />
            <Stack.Screen name="notifModal" component={NotificationsModal} />
            <Stack.Screen name="manageFriends" component={ManageFriendsModal} />
            <Stack.Screen
              name="createCustomProperty"
              options={{ gestureEnabled: false }}
              component={CreateCustomProperty}
            />
          </Stack.Group>
          <Stack.Screen
            name="textReviewModal"
            component={TextReview}
            options={{
              presentation: "modal",
              gestureDirection: "horizontal",
            }}
          />
          <Stack.Screen name="ProfileScreen" component={Profile} />
          <Stack.Screen name="UsernameEditing" component={UsernameEditing} />
          <Stack.Screen name="EmailEditing" component={EmailEditing} />
        </>
      )}
    </Stack.Navigator>
  );
}
export default AppNavigation;
