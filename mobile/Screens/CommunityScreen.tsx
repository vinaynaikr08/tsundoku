import React from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  StyleSheet,
} from "react-native";
import { DATA } from "@/Components/BookSearchBar/Genres";
import { Databases, Query } from "appwrite";
import { client } from "@/appwrite";
import CommunityTabs from "../Components/CommunityTabs/CommunityTabs";
import { NavigationContext } from "../Contexts";
import { SafeAreaView } from "react-native-safe-area-context";

const databases = new Databases(client);

export const Community = (props) => {
  const windowHeight = Dimensions.get("window").height;
  const { navigation } = props;

  return (
    <NavigationContext.Provider value={navigation}>
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
              Community
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <CommunityTabs />
      </SafeAreaView>
    </NavigationContext.Provider>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButton: {
    fontSize: 16,
    color: "blue",
    textAlign: "center",
  },
});
