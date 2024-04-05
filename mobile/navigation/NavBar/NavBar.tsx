import { View } from "react-native";
import React from "react";
import { useState } from "react";
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

function TrackScreen() {
  return null;
}

function NavBar() {
  const [isTrackModalVisible, setIsTrackModalVisible] = useState(false);
  const toggleTrackModal = () => {
    setIsTrackModalVisible(!isTrackModalVisible);
  };

  return (
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
        name="+"
        component={TrackScreen}
        listeners={() => ({
          tabPress: (e) => {
            e.preventDefault();
            toggleTrackModal();
          },
        })}
        options={{
          tabBarIcon: () => <PlusIcon />,
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
