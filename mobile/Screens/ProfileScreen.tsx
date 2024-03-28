import React from "react";
import { View, Text, TouchableWithoutFeedback, Keyboard } from "react-native";
import { ProfileContext } from "../Contexts";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileTabs from "@/Components/ProfileTabs/ProfileTabs";
import useSWR from "swr";
import Backend from "@/Backend";

const backend = new Backend();

export const Profile = (props) => {
  const { data, error, isLoading } = useSWR("", backend.getAccountName);

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
              {data || "Profile"}
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <ProfileTabs />
      </SafeAreaView>
    </ProfileContext.Provider>
  );
};
