import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { Query } from "appwrite";
import { client } from "../../appwrite";
import { Databases, Account } from "appwrite";
import ID from "../../Constants/ID";
// import { BACKEND_API_FRIENDS_URL } from "@/Constants/URLs";

const databases = new Databases(client);

const ManageFriendsModal = () => {
  const [friends, setFriends] = useState(null);
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
          setFriends(
            filtered.map((friend) =>
              user_id == friend.requestee ? friend.requester : friend.requestee,
            ),
          );
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
          marginBottom: 10,
        }}
      />

      <View
        style={{
          flexDirection: "row",
          paddingTop: 10,
          paddingBottom: 10,
          width: "100%",
        }}
      >
        <FlatList
          data={friends}
          scrollEventThrottle={1}
          style={{
            flex: 1,
            marginBottom: 0,
          }}
          renderItem={({ item }) => {
            return (
              <View style={{ marginLeft: 20 }}>
                <Text style={{ fontSize: 17 }}>{item}</Text>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
};

export default ManageFriendsModal;
