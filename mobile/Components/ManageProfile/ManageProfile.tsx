import Colors from "@/Constants/Colors";
import { BACKEND_API_SOCIAL_URLS, BACKEND_API_URL, BACKEND_API_USER_ABOUT_ME } from "@/Constants/URLs";
import { client } from "@/appwrite";
import { useFocusEffect } from "@react-navigation/native";
import { Account } from "appwrite";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Linking } from "react-native";
import { Divider } from "react-native-paper";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { ProfileContext } from "../../Contexts";

function ManageProfile({ navigation }) {
  const account = new Account(client);
  const [username, setUsername] = useState(null);
  const [bio, setBio] = useState(null);
  const [email, setEmail] = useState(null);
  const [social, setSocial] = useState(null);
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
          const fetchedBio = await getBio();
          setBio(fetchedBio);
          const fetchedSocial = await getSocial();
          setSocial(fetchedSocial);
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

  async function getBio() {
    try {
      const res = await fetch(`${BACKEND_API_USER_ABOUT_ME}`, {
        method: "GET",
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: "Bearer " + (await account.createJWT()).jwt,
        }),
      });
      const res_json = await res.json();
      console.log(res_json);
      return res_json.about_me_bio;
    } catch (error) {
      console.error("Error fetching username:", error);
    }
  }

  async function getSocial() {
    try {
      const res = await fetch(`${BACKEND_API_SOCIAL_URLS}`, {
        method: "GET",
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: "Bearer " + (await account.createJWT()).jwt,
        }),
      });
      const res_json = await res.json();
      console.log(res_json);
      return res_json.social_url;
    } catch (error) {
      console.log("Error fetching socials:", error);
    }
  }

  return (
    <ProfileContext.Provider value={navigation}>
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
      <View style={styles.userInfoRow}>
        <Text
          style={styles.userInfoText}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          Bio: {bio ? bio : <Text style={{ color: "grey" }}>none</Text>}
        </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("AboutMeEditing");
          }}
        >
          <MaterialIcons name="edit" size={22} color={Colors.BUTTON_PURPLE} />
        </TouchableOpacity>
      </View>
      <View style={styles.userInfoRow}>
        <Text
          style={styles.socialText}
        >
          Social Url:{" "}
        </Text>
        <Text
          style={styles.socialUrlText}
          numberOfLines={1}
          ellipsizeMode="tail"
          onPress={async () => {
            if (social) {
              await Linking.openURL(social);
            }
          }}
        >
          {social ? social : <Text style={{ color: "grey" }}>none</Text>}
        </Text>
        
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("SocialEditing");
          }}
        >
          <MaterialIcons name="edit" size={22} color={Colors.BUTTON_PURPLE} />
        </TouchableOpacity>
      </View>
      <Divider />
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
    marginLeft: 20,
    margin: 12,
  },
  socialText: {
    fontSize: 20,
    marginLeft: 20,
    marginVertical: 12,
    
  },
  socialUrlText: {
    fontSize: 20,
    width: '75%',
  },
});
