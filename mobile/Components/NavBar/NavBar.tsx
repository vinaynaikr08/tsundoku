import {
    StyleSheet,
    Text,
    View,
  } from "react-native";
import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import Colors from "../../Constants/Colors";
import { Library } from "../../Screens/Library";
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
  
const Stack = createNativeStackNavigator();

export const NavBar = () => {
  // home
  
  // library

  // add

  // social

  // profile
  
  <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Library"
          component={Library}
        //   options={{title: 'Welcome'}}
        />
        {/* <Stack.Screen name="Profile" component={ProfileScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>

};
  
const styles = StyleSheet.create({
    
});
  
export default NavBar;
  