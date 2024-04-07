import React, { useEffect, useState, useReducer } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { Query } from "appwrite";
import { client } from "../../appwrite";
import { Databases, Account } from "appwrite";
import ID from "../../Constants/ID";
import { BACKEND_API_URL } from "@/Constants/URLs";
import { Icon } from "@rneui/base";
import { ActivityIndicator, Divider} from "react-native-paper";
import ErrorModal from "../ErrorModal";
import { Overlay, Button } from "@rneui/base";
import Toast from "react-native-toast-message";

const databases = new Databases(client);

function ManageFriendsModal ({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [years, setYears] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  useEffect(() => {
    const account = new Account(client);
    account
      .get()
      .then((response) => {
        const user_id = response.$id;
        const databases = new Databases(client);
        const promise = databases.listDocuments(
          ID.mainDBID,
          ID.wrappedsCollectionID,
          [
              Query.select(["year", ]),
              Query.equal("user_id", user_id),
              Query.orderAsc("year"),
          ],
        );
        promise.then(function (response) {
          const documents = response.documents;
          setYears(documents);
          setLoading(false);
        });
      })
      .catch((error) => {
        setErrorMessage("Error fetching user id");
        setErrorModalVisible(true);
        console.log(error);
      });
  }, []);

  return (
    <View style={{ alignItems: "center", paddingTop: 20 }}>
      <Text style={{ fontSize: 25 }}>Past Wrappeds</Text>

      <View
        style={{
          backgroundColor: "#9c9c9c",
          width: "20%",
          height: 1,
          marginTop: 15,
        }}
      />

      <View
        style={{
          flexDirection: "row",
          paddingTop: 10,
          width: "100%",
        }}
      >
        <View style={{position: 'absolute', justifyContent: 'center', alignItems: "center", width: '100%', top: 20}}>
          <ActivityIndicator size="large" color="grey" animating={loading}/>
        </View>

        <FlatList
        data={years}
        scrollEventThrottle={1}
        style={{
          flex: 1,
          marginBottom: 0,
        }}
        renderItem={({item} : any) => {
          return (
            <TouchableOpacity onPress={() => {
              navigation.goBack();
                navigation.navigate("wrappedScreen", {
                year: item.year,
              });
            }}>
                <View style={{ marginLeft: 20, marginTop: 10}}>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={{ fontSize: 17, marginBottom: 10, flex: 6}}>{item.year} Wrapped</Text>
                  </View>
                  <Divider/>
                </View>
            </TouchableOpacity>
          );
        }}
        />
      </View>
      <ErrorModal
        message={errorMessage}
        visible={errorModalVisible}
        setVisible={setErrorModalVisible}
      />
    </View>
  );
}

export default ManageFriendsModal;
