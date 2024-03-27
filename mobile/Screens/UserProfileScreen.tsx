import React from "react";
import { View, Text, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from "react-native";
import { client } from "../appwrite";
import { Account } from "appwrite";
import { ProfileContext } from "../Contexts";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileTabs from "@/Components/ProfileTabs/ProfileTabs";
import Ionicons from "react-native-vector-icons/Ionicons";

export const UserProfile = ({ navigation, route }) => {
  const { username, user_id } = route.params;

  React.useEffect(() => {
    const account = new Account(client);
  }, []);

  return (
    <SafeAreaView style={{ flexGrow: 1, backgroundColor: "white" }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View>
          <TouchableOpacity
            style={{
              margin: 15,
              marginBottom: 10,
              marginLeft: 10,
              alignSelf: "flex-start",
            }}
            onPress={() => navigation.pop()}
          >
            <Ionicons name={"chevron-back"} color="black" size={25} />
          </TouchableOpacity>
          <Text
            style={{
              marginLeft: 20,
              marginBottom: 15,
              marginTop: 5,
              fontWeight: "700",
              fontSize: 21,
            }}
          >
            {username}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};
