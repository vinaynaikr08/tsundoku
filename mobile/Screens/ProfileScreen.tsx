import React from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { client } from "../appwrite";
import { Account } from "appwrite";
import { ProfileContext } from "../Contexts";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileTabs from "@/Components/ProfileTabs/ProfileTabs";


export const Profile = (props) => {
  const [username, setUsername] = React.useState(null);

  React.useEffect(() => {
    const account = new Account(client);
    account
      .get()
      .then((response) => {
        setUsername(response.name);
      })
      .catch((error) => {
        console.error("Error fetching user ID: ", error);
      });
  }, []);

  return (
    <ProfileContext.Provider value={props}>
      <SafeAreaView style={{ flexGrow: 1, backgroundColor: "white" }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View>
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
        <ProfileTabs />
      </SafeAreaView>
    </ProfileContext.Provider>
  );
};
