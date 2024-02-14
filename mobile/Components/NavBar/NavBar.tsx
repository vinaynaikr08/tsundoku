import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import Colors from "../../Constants/Colors";
import { Library } from "../../Screens/Library";
import { SignIn } from "../../Screens/SignIn";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "react-native-vector-icons/Entypo";
import Book from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from "react-native-vector-icons/Ionicons";

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
      <Text>social!</Text>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Text>Profile!</Text>
    </View>
  );
}

function NavBar() {
  return (
    <NavigationContainer>
      <BottomBar.Navigator>
        <BottomBar.Screen
          // currently is sign-in screen for testing
          name="home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Home name="home" size={size} color={color} />
            ),
          }}
        />
        <BottomBar.Screen
          name="library"
          component={LibraryScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Book name="book" size={size} color={color} />
            ),
          }}
        />
        <BottomBar.Screen
          name="+"
          component={TrackScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="add-circle" size={size} color={color} />
            ),
          }}
        />
        <BottomBar.Screen
          name="social"
          component={SocialScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="share-social-outline" size={size} color={color} />
            ),
          }}
        />
        <BottomBar.Screen
          name="profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="person-circle" size={size} color={color} />
            ),
          }}
        />
      </BottomBar.Navigator>
    </NavigationContainer>
  );
}

export default NavBar;
