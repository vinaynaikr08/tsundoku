import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import Colors from "../../Constants/Colors";
import { Library } from "../../Screens/Library";
import { SignIn } from "../../Screens/SignIn";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Stack = createNativeStackNavigator();
const BottomBar = createBottomTabNavigator();

function HomeScreen() {
  return (
    <View style={{ flex: 1 }}>
      <SignIn />
    </View>
  );
}

function LibraryScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Library />
    </View>
  );
}

function TrackScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Text>track!</Text>
    </View>
  );
}

function SocialScreen() {
  return (
    <View style={{ flex: 1 }}>
      {
        // insert social screen here
      }
      <Text>social!</Text>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={{ flex: 1 }}>
      {
        // insert profile screen here
        /* <Library /> */
      }
      <Text>Profile!</Text>
    </View>
  );
}

// add review
function NavBar() {
  return (
    <NavigationContainer>
      <BottomBar.Navigator>
        <BottomBar.Screen
          // currently is sign-in screen for testing
          name="home"
          component={HomeScreen}
        />
        <BottomBar.Screen name="library" component={LibraryScreen} />
        <BottomBar.Screen name="+" component={TrackScreen} />
        <BottomBar.Screen name="social" component={SocialScreen} />
        <BottomBar.Screen name="profile" component={ProfileScreen} />
      </BottomBar.Navigator>
    </NavigationContainer>
  );
}

export default NavBar;
