import React, { useEffect, useState } from "react";
import { View, Text, Switch } from "react-native"
import ID from "../../Constants/ID"
import { Query } from "appwrite";
import { client } from "../../appwrite";
import { Databases, Account } from "appwrite";
import { ID as UID }  from  "appwrite" ;
import { Permission, Role } from "appwrite";

import Colors from "../../Constants/Colors";
import { Button } from "react-native-paper";
import Toast from "react-native-toast-message";

const databases = new Databases(client);

function userPermissions(user_id: string) {
    return [
      Permission.read(Role.user(user_id)),
      Permission.update(Role.user(user_id)),
      Permission.delete(Role.user(user_id)),
    ];
}

async function saveNotifs(notif, notifFriend, notifFriendReq, setChanged) {
    const account = new Account(client);
    const response = await account.get();
    let db_query;

    try {
        const user_id = response.$id;
        const databases = new Databases(client);
        db_query = await databases.listDocuments(
            ID.mainDBID,
            ID.notificationsCollectionID,
            [Query.equal("user_id", user_id),],
        );

        if (db_query.total == 0) {
            // Create new object
            const res = await databases.createDocument(
                ID.mainDBID,
                ID.notificationsCollectionID,
                UID.unique(),
                {
                    user_id,
                    notif,
                    notifFriendReq,
                    notifFriend,
                },
                userPermissions(user_id),
            );
        } else {
            const notification_id = db_query.documents[0].$id;
            try {
                await databases.updateDocument(
                    ID.mainDBID,
                    ID.notificationsCollectionID,
                    notification_id,
                    {
                        general: notif,
                        new_follower: notifFriendReq,
                        friend_reading_status_update: notifFriend,
                    },
                    userPermissions(user_id),
                );
            } catch (error) {
                return console.log(error);
            }
        }
    } catch (error) {
        console.error(error);
    }
    Toast.show({
        type: "success",
        text1: "Notification settings successfully saved!",
        position: "bottom",
        visibilityTime: 2000,
    });
    setChanged(false);
    return;
}

const NotificationsModal = (props) => {
    const { navigation } = props;
    const [changed, setChanged] = useState(false);
    const [notif, setNotif] = useState(false);
    const [notifFriend, setNotifFriend] = useState(false);
    const [notifFriendReq, setNotifFriendReq] = useState(false);
    //const [notifAuthor, setNotifAuthor] = useState(false);

    useEffect(() => {
        const account = new Account(client);
        account
          .get()
          .then((response) => {
            try {
                const user_id = response.$id;
                const databases = new Databases(client);
                const promise = databases.listDocuments(
                    ID.mainDBID,
                    ID.notificationsCollectionID,
                    [Query.equal("user_id", user_id),],
                );

                promise.then(function (response) {
                    const documents = response.documents[0];
                    setNotif(documents.general);
                    setNotifFriend(documents.friend_reading_status_update);
                    setNotifFriendReq(documents.new_follower);
                })  
            } catch (error) {
                console.error(error);
            }
          })
          .catch((error) => {
            console.error("Error fetching user ID:", error);
          });
      }, []);

    return (
        <View style={{alignItems: 'center', paddingTop: 20}}>
            <Text style={{fontSize: 25}}>
                Notification Settings
            </Text>

            <View style={{backgroundColor: '#9c9c9c', width: "20%", height: 1, marginTop: 15, marginBottom: 10}}/>

            <View
                style={{
                flexDirection: "row",
                paddingTop: 10,
                paddingBottom: 10,
                width: "100%",
            }}>
                <Text style={{ fontSize: 20, paddingLeft: 20, flex: 9 }}>
                    All notifications
                </Text>
                <View style={{ flex: 2 }}>
                    <Switch
                        trackColor={{
                        false: Colors.BUTTON_GRAY,
                        true: Colors.BUTTON_PURPLE,
                        }}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => {setNotif(!notif); setChanged(true); }}
                        value={notif}
                    />
                </View>
            </View>
            
            <View style={{backgroundColor: '#d4d4d4', width: "100%", height: 1, marginTop: 5, marginBottom: 5}}/>

            <View
                style={{
                flexDirection: "row",
                paddingTop: 10,
                paddingBottom: 10,
                width: "100%",
            }}>
                <Text style={{ fontSize: 20, paddingLeft: 20, flex: 9 }}>
                    Friends update status
                </Text>
                <View style={{ flex: 2 }}>
                    <Switch
                        trackColor={{
                            false: Colors.BUTTON_GRAY,
                            true: Colors.BUTTON_PURPLE,
                        }}
                        disabled={!notif}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => {setNotifFriend(!notifFriend); setChanged(true);} }
                        value={notifFriend}
                    />
                </View>
            </View>
            
            {/* <View style={{backgroundColor: '#d4d4d4', width: "100%", height: 1, marginTop: 5, marginBottom: 5}}/>
            
            <View
                style={{
                flexDirection: "row",
                paddingTop: 10,
                paddingBottom: 10,
                width: "100%",
            }}>
                <Text style={{ fontSize: 20, paddingLeft: 20, flex: 9 }}>
                    New book from author
                </Text>
                <View style={{ flex: 2 }}>
                    <Switch
                        trackColor={{
                            false: Colors.BUTTON_GRAY,
                            true: Colors.BUTTON_PURPLE,
                        }}
                        disabled={!notif}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => setNotifAuthor(!notifAuthor)}
                        value={notifAuthor}
                    />
                </View>
            </View> */}

            <View style={{backgroundColor: '#d4d4d4', width: "100%", height: 1, marginTop: 5, marginBottom: 5}}/>
            
            <View
                style={{
                flexDirection: "row",
                paddingTop: 10,
                paddingBottom: 10,
                width: "100%",
            }}>
                <Text style={{ fontSize: 20, paddingLeft: 20, flex: 9 }}>
                    Friend request
                </Text>
                <View style={{ flex: 2 }}>
                    <Switch
                        trackColor={{
                            false: Colors.BUTTON_GRAY,
                            true: Colors.BUTTON_PURPLE,
                        }}
                        disabled={!notif}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => {setNotifFriendReq(!notifFriendReq); setChanged(true); }}
                        value={notifFriendReq}
                    />
                </View>
            </View>

            <View style={{backgroundColor: '#d4d4d4', width: "100%", height: 1, marginTop: 5, marginBottom: 5}}/>

            <View style={{marginTop: 20}}>
                <Button onPress={() => {saveNotifs(notif, notifFriend, notifFriendReq, setChanged); navigation.goBack()}} disabled={!changed} mode={"outlined"}>
                    <Text>Save Settings</Text>
                </Button>
            </View>
        </View>
    );
}

export default NotificationsModal;