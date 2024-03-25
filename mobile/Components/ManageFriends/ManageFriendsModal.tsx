import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { Query } from "appwrite";
import { client } from "../../appwrite";
import { Databases, Account } from "appwrite";
import ID from "../../Constants/ID";
import { BACKEND_API_URL } from "@/Constants/URLs";
import { Icon } from "@rneui/base";
import { ActivityIndicator, Divider} from "react-native-paper";
import ErrorModal from "../ErrorModal";

const databases = new Databases(client);

const ManageFriendsModal = () => {
  //const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [friendNames, setFriendNames] = useState(null);
  let friends = [];
  let friendName = [];
  useEffect(() => {
    const account = new Account(client);
    account
      .get()
      .then((response) => {
        const user_id = response.$id;
        const databases = new Databases(client);
        const promise = databases.listDocuments(
          ID.mainDBID,
          ID.friendsCollectionID,
          [
            Query.or([
              Query.equal("requester", user_id),
              Query.equal("requestee", user_id),
            ]),
          ],
        );
        promise.then(function (response) {
          const documents = response.documents;
          const filtered = documents.filter((doc) => doc.status == "ACCEPTED");
          friends = filtered.map((friend) => (user_id == friend.requestee) ? friend.requester : friend.requestee)
        })
        .then(async () => {
            try {
                for (const friendId of friends) {
                    const response = await fetch(
                        `${BACKEND_API_URL}/v0/users/${friendId}/name`,
                        {
                        method: "GET",
                        headers: new Headers({
                            "Content-Type": "application/json",
                            Authorization: "Bearer " + (await account.createJWT()).jwt,
                        }),
                        },
                    );
                    const name = await response.json();
                    friendName.push(name.name);
                }
                setLoading(false);
                setFriendNames(friendName);
            } catch (error) {
                setErrorMessage("Error fetching friends");
                setErrorModalVisible(true);
                console.log(error);
            }
        });
      })
      .catch((error) => {
        console.error("Error fetching user ID:", error);
      });
  }, []);
  return (
    <View style={{ alignItems: "center", paddingTop: 20 }}>
      <Text style={{ fontSize: 25 }}>Manage Friends</Text>

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
        data={friendNames}
        scrollEventThrottle={1}
        style={{
          flex: 1,
          marginBottom: 0,
        }}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity activeOpacity={1}>
                <View style={{ marginLeft: 20}}>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={{ fontSize: 17, marginBottom: 10, flex: 7 }}>{item}</Text>
                    <View style={{flex: 1}}>
                      <Icon name="clear" color="red"/>
                    </View>
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
};

export default ManageFriendsModal;
