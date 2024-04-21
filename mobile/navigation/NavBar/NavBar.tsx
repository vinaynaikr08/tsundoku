import { Platform, View } from "react-native";
import React from "react";
import Colors from "../../Constants/Colors";
import Dimensions from "../../Constants/Dimensions";
import { Library } from "../../Screens/Library";
import { Profile } from "../../Screens/ProfileScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "react-native-vector-icons/Entypo";
import { Community } from "../../Screens/CommunityScreen";
import Book from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from "react-native-vector-icons/Ionicons";
import { Discover } from "../../Screens/Discover";

const BottomBar = createBottomTabNavigator();

function NavBar() {
  return (
    <BottomBar.Navigator
      screenOptions={() => ({
        tabBarLabel: () => null,
        headerShown: false,
        tabBarActiveTintColor: Colors.BUTTON_PURPLE,
        tabBarStyle: {
          height: Platform.OS === "ios" ? 90 : 60,
        },
      })}
    >
      <BottomBar.Screen
        name="home"
        component={Library}
        options={{
          tabBarIcon: ({ color }) => (
            <Home
              name="home"
              size={Dimensions.NAVBAR_ICON_SIZE}
              color={color}
            />
          ),
        }}
      />
      <BottomBar.Screen
        name="discover"
        component={Discover}
        options={{
          tabBarIcon: ({ color }) => (
            <Book
              name="book"
              size={Dimensions.NAVBAR_ICON_SIZE}
              color={color}
            />
          ),
        }}
      />
      <BottomBar.Screen
        name="social"
        component={Community}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon
              name="share-social-outline"
              size={Dimensions.NAVBAR_ICON_SIZE}
              color={color}
            />
          ),
        }}
      />
      <BottomBar.Screen
        name="profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon
              testID="navbar-profile-screen"
              name="person-circle"
              size={Dimensions.NAVBAR_ICON_SIZE}
              color={color}
            />
          ),
        }}
      />
    </BottomBar.Navigator>
  );
}

export default NavBar;
