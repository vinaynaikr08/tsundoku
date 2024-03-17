import React, { useState } from "react";
import { View, Text, Switch } from "react-native"

import Colors from "../../Constants/Colors";

const NotificationsModal = () => {
    const [notif, setNotif] = useState(true);
    const [notifFriend, setNotifFriend] = useState(false);
    const [notifFriendReq, setNotifFriendReq] = useState(false);
    const [notifAuthor, setNotifAuthor] = useState(false);


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
                        onValueChange={() => setNotif(!notif)}
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
                    Friends post reviews
                </Text>
                <View style={{ flex: 2 }}>
                    <Switch
                        trackColor={{
                            false: Colors.BUTTON_GRAY,
                            true: Colors.BUTTON_PURPLE,
                        }}
                        disabled={!notif}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => setNotifFriend(!notifFriend)}
                        value={notifFriend}
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
                        onValueChange={() => setNotifFriendReq(!notifFriendReq)}
                        value={notifFriendReq}
                    />
                </View>
            </View>
        </View>
    );
}

export default NotificationsModal;