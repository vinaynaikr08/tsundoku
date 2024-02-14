import {
    StyleSheet,
    Text,
    View,
  } from "react-native";
import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import Colors from "../../Constants/Colors";
import { Library } from "../../Screens/Library";
import { SignIn } from "../../Screens/SignIn";
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
  
const Stack = createNativeStackNavigator();
const BottomBar = createBottomTabNavigator();

function HomeScreen() {
    return (
      <View style={{ flex: 1}}>
        <SignIn />
      </View>
    );
  }

  function LibraryScreen() {
    return (
      <View style={{ flex: 1}}>
        <Library />
      </View>
    );
  }

  // add review
  // social
  // profile
function NavBar() {
    return (
<NavigationContainer>
<BottomBar.Navigator>
        
      <BottomBar.Screen
      // currently is sign-in screen for testing
        name="home"
        component={HomeScreen}
      />
       <BottomBar.Screen
        name="library"
        component={LibraryScreen}
      />
      
    </BottomBar.Navigator>
    </NavigationContainer>
    );
}
  
export default NavBar;
  