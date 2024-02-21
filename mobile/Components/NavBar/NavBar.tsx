import { View, Text, Button, TouchableOpacity } from "react-native";
import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import Colors from "../../Constants/Colors";
import Dimensions from "../../Constants/Dimensions";
import { Library } from "../../Screens/Library";
import { SignIn } from "../../Screens/SignIn";
import { Profile } from "../../Screens/ProfileScreen";
import TrackModal from "../../Components/TrackModal";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "react-native-vector-icons/Entypo";
import Book from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from "react-native-vector-icons/Ionicons";
import Modal from "react-native-modal";
import StarRating from "../StarRating/StarRating";
import TextReview from "../TextReview/TextReview";

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
  return null;
}

function SocialScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Text>social!</Text>
    </View>
  );
}

function ProfileScreen() {
  return <Profile />;
}

function NavBar() {
  const [isTrackModalVisible, setIsTrackModalVisible] = useState(false);
  const toggleTrackModal = () => {
    setIsTrackModalVisible(!isTrackModalVisible);
  };

  return (
    <NavigationContainer>
      <BottomBar.Navigator
        screenOptions={() => ({
          tabBarLabel: () => null,
          headerShown: false,
          tabBarActiveTintColor: Colors.BUTTON_PURPLE,
          tabBarStyle: {
            height: 90,
          },
          tabBarIconStyle: {
            marginTop: 10,
          },
        })}
      >
        <BottomBar.Screen
          // currently is sign-in screen for testing
          name="home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Home
                name="home"
                size={Dimensions.NAVBAR_ICON_SIZE}
                color={color}
              />
            ),
          }}
        />
        <BottomBar.Screen
          name="library"
          component={LibraryScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Book
                name="book"
                size={Dimensions.NAVBAR_ICON_SIZE}
                color={color}
              />
            ),
          }}
        />
        <BottomBar.Screen
          name="+"
          component={TrackScreen}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              toggleTrackModal();
            },
          })}
          options={{
            tabBarIcon: ({ color, size }) => <PlusIcon />,
          }}
        />
        <BottomBar.Screen
          name="social"
          component={SocialScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
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
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon
                name="person-circle"
                size={Dimensions.NAVBAR_ICON_SIZE}
                color={color}
              />
            ),
          }}
        />
      </BottomBar.Navigator>
      <TrackModal isVisible={isTrackModalVisible} onClose={toggleTrackModal} />
    </NavigationContainer>
  );
}

function PlusIcon() {
  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <View
        style={{
          backgroundColor: "white",
          borderRadius: 50,
          width: 80,
          height: 80,
          marginBottom: 20,
        }}
      >
        <Icon name="add-circle" size={80} color={Colors.BUTTON_PURPLE} />
      </View>
    </View>
  );
}

export default NavBar;
