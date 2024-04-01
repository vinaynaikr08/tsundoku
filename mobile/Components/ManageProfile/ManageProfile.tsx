import Colors from "@/Constants/Colors";
import { BACKEND_API_URL } from "@/Constants/URLs";
import { client } from "@/appwrite";
import { useFocusEffect } from "@react-navigation/native";
import { Account } from "appwrite";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Divider } from "react-native-paper";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { ProfileContext } from "../../Contexts";

function ManageProfile({ navigation }) {
  const account = new Account(client);
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const account = new Account(client);
          const response = await account.get();
          setEmail(response.email);
          const fetchedUserId = response.$id;
          const fetchedUsername = await getUsername(fetchedUserId);
          setUsername(fetchedUsername);
        } catch (error) {
          console.error("Error fetching user ID or username:", error);
        }
      };

      fetchData();
    }, []),
  );

  async function getUsername(user_id) {
    try {
      const response = await fetch(
        `${BACKEND_API_URL}/v0/users/${user_id}/name`,
        {
          method: "GET",
          headers: new Headers({
            "Content-Type": "application/json",
            Authorization: "Bearer " + (await account.createJWT()).jwt,
          }),
        },
      );
      const usernameData = await response.json();
      return usernameData.name;
    } catch (error) {
      console.error("Error fetching username:", error);
      throw error;
    }
  }

  return (
    <ProfileContext.Provider value={navigation}>
      <ScrollView
        testID="profile-tab-scroll-view"
        style={{ flex: 1 }}
        bounces={false}
        contentContainerStyle={styles.scrollViewStyle}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.userInfoRow}>
          <Text style={styles.userInfoText}>Username: {username}</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("UsernameEditing");
            }}
          >
            <MaterialIcons name="edit" size={22} color={Colors.BUTTON_PURPLE} />
          </TouchableOpacity>
        </View>
        <View style={styles.userInfoRow}>
          <Text
            style={styles.userInfoText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            Email: {email}
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("EmailEditing");
            }}
          >
            <MaterialIcons name="edit" size={22} color={Colors.BUTTON_PURPLE} />
          </TouchableOpacity>
        </View>
        <Divider />
      </ScrollView>
    </ProfileContext.Provider>
  );
}

export default ManageProfile;

const styles = StyleSheet.create({
  scrollViewStyle: {
    paddingHorizontal: 5,
    backgroundColor: "white",
  },
  text: {
    fontSize: 20,
    margin: 20,
  },
  userInfoRow: {
    width: "80%",
    flexDirection: "row",
    alignItems: "center",
  },
  userInfoText: {
    fontSize: 20,
    margin: 20,
  },
});
