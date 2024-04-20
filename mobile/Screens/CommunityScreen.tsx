import Colors from "@/Constants/Colors";
import ID from "@/Constants/ID";
import { client } from "@/appwrite";
import { Icon, Overlay } from "@rneui/base";
import { Account, Databases, Query } from "appwrite";
import React from "react";
import {
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CommunityTabs from "../Components/CommunityTabs/CommunityTabs";
import { NavigationContext } from "../Contexts";

const account = new Account(client);
const databases = new Databases(client);

export const Community = (props) => {
  const { navigation } = props;

  const [notifs, setNotifs] = React.useState([]);
  const [isOverlayVisible, setOverlayVisible] = React.useState(false);

  React.useEffect(() => {
    account.get().then((response) => {
      const user_id = response.$id;
      const promise = databases.listDocuments(
        ID.mainDBID,
        ID.notificationDataCenterCollectionID,
        [Query.equal("user_id", user_id), Query.limit(10)],
      );

      promise
        .then(function (response) {
          const documents = response.documents;
          setNotifs(documents);
        })
        .catch((error) => console.log(error));
    });
  }, [isOverlayVisible]);

  return (
    <NavigationContext.Provider value={navigation}>
      <SafeAreaView style={{ flexGrow: 1, backgroundColor: "white" }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                marginLeft: 20,
                marginBottom: 15,
                marginTop: 5,
                fontWeight: "700",
                fontSize: 21,
                flex: 5,
              }}
            >
              Community
            </Text>
            <View style={{ flex: 1, marginTop: 5, width: "100%" }}>
              <TouchableOpacity onPress={() => setOverlayVisible(true)}>
                <Icon name="notifications" color={Colors.BUTTON_PURPLE} />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <CommunityTabs />
        <Overlay
          isVisible={isOverlayVisible}
          onBackdropPress={() => setOverlayVisible(false)}
          statusBarTranslucent
          overlayStyle={{
            width: 300,
            height: 600,
            backgroundColor: "white",
            borderRadius: 15,
          }}
        >
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 20, marginTop: 5 }}>Notifications</Text>
            <View
              style={{
                width: 300,
                height: 1,
                backgroundColor: "#d3d3d3",
                marginTop: 20,
              }}
            />
            <View style={{ height: 540 }}>
              <FlatList
                data={notifs.reverse()}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => (
                  <View
                    style={{
                      width: "100%",
                      height: 1,
                      backgroundColor: "#d3d3d3",
                      alignSelf: "center",
                    }}
                  />
                )}
                renderItem={(item) => {
                  return (
                    <View
                      style={{
                        marginTop: 10,
                        marginBottom: 10,
                        paddingRight: 10,
                        paddingLeft: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontSize: 18,
                          marginBottom: 2,
                        }}
                      >
                        {item.item.title}
                      </Text>
                      <Text>{item.item.description}</Text>
                      <Text>
                        {new Date(item.item.$createdAt).toLocaleString()}
                      </Text>
                    </View>
                  );
                }}
              />
            </View>
          </View>
        </Overlay>
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
