import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native"
import { Query } from "appwrite";
import { client } from "../../appwrite";
import { Databases, Account } from "appwrite";
import ID from "../../Constants/ID";
import { BACKEND_API_FRIENDS_URL } from "@/Constants/URLs";


const databases = new Databases(client);

const ManageFriendsModal = () => {
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
              [Query.or(
                [
                    Query.equal("requester", user_id),
                    Query.equal("requestee", user_id),
                ]
              ), Query.select(["status"])],
            );
            promise.then((response) => {
                console.log(response);
            });
          })
          .catch((error) => {
            console.error("Error fetching user ID:", error);
          });    
    }, []);
    return (
        <View style={{alignItems: 'center', paddingTop: 20}}>
            <Text style={{fontSize: 25}}>
                Manage Friends
            </Text>

            <View style={{backgroundColor: '#9c9c9c', width: "20%", height: 1, marginTop: 15, marginBottom: 10}}/>

            <View
                style={{
                flexDirection: "row",
                paddingTop: 10,
                paddingBottom: 10,
                width: "100%",
            }}>
                <FlatList
                    data={null}
                    scrollEventThrottle={1}
                    style={{
                        flex: 1,
                        marginBottom: 0,
                    }}
                    renderItem={({ item }) => {
                        return (<View/>);
                    }}
                />

            </View>

            {/* <FlatList>

            </FlatList> */}
        </View>
    );
}

export default ManageFriendsModal;