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
import { debounce } from "lodash";

const databases = new Databases(client);

async function updateNotifications(doc_ids, in_or_out, friends) {
  const account = new Account(client);
  const user_id = (await account.get()).$id;
  for (let i = 0; i < doc_ids.length; i++) {
    if (in_or_out[0] == 1) {
      await databases.updateDocument(
        ID.mainDBID,
        ID.friendsCollectionID,
        doc_ids[i],
        {
          requestee_notifs: friends[i].notifs,
        }
      )
    }
    else {
      await databases.updateDocument(
        ID.mainDBID,
        ID.friendsCollectionID,
        doc_ids[i],
        {
          requester_notifs: friends[i].notifs,
        }
      )
    }
  }
  console.log('notifications saved');
}

async function deleteFriend(doc_id, setConfirmation) {
  
  const promise = databases.deleteDocument(
    ID.mainDBID,
    ID.friendsCollectionID,
    doc_id,
  );
  promise.then(function (response_1) {
    console.log(response_1); // Success
    Toast.show({
      type: "success",
      text1: "Friend Removed",
      position: "bottom",
      visibilityTime: 2000,
    });
    setConfirmation(false);
  }, function (error) {
      console.log(error); // Failure
  });
}

function ManageFriendsModal ({ navigation }) {
  //const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [friendNames, setFriendNames] = useState([]);
  let friends = [];
  let friend_name = [];
  const [documentIds, setDocumentIds] = useState([]);
  const [confirmation, setConfirmation] = useState(false);
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const [inOut, setInOut] = useState([]);

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
          friends = filtered.map((friend) => (user_id == friend.requestee) ? 
          {id: friend.requester, notifs: friend.requestee_notifs, in_or_out: 1, } : 
          {id: friend.requestee, notifs: friend.requester_notifs, in_or_out: 2, });
          setDocumentIds(filtered.map((element) => element.$id));
          setInOut(friends.map((element) => element.in_or_out));
        })
        .then(async () => {
            try {
                for (let i = 0; i < friends.length; i++) {
                    const friendId = friends[i].id;
                    const notifs = friends[i].notifs;
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
                    friend_name.push({username: name.name, id: friendId, notifs: notifs, });
                }
                setLoading(false);
                setFriendNames(friend_name);
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
  }, [confirmation]);

  const debounceUpdates = React.useCallback(
    debounce(updateNotifications, 5000),
    [],
  );
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
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity onPress={() => {
              navigation.goBack();
              navigation.navigate("UserProfileScreen", {
                username: item.username,
                user_id: item.id,
              });
            }}>
                <View style={{ marginLeft: 20, marginTop: 10}}>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={{ fontSize: 17, marginBottom: 10, flex: 6}}>{item.username}</Text>
                    <TouchableOpacity style={{flex: 1}} onPress={() => {debounceUpdates(documentIds, inOut, friendNames); item.notifs = !item.notifs; forceUpdate();}}>
                      {item.notifs ? <Icon name="notifications" color="purple"/> : <Icon name="notifications-off" color="purple"/>}
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex: 1}} onPress={() => setConfirmation(true)}>
                      <Icon name="clear" color="red"/>
                    </TouchableOpacity>
                  </View>
                  <Divider/>
                </View>
                <Overlay
                  isVisible={confirmation}
                  onBackdropPress={() => setConfirmation(false)}
                  overlayStyle={{backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', width: '60%', height: '20%', borderRadius: 10}}
                >
                  <Text style={{textAlign: 'center', fontSize: 20, paddingBottom: 10}}>Remove {item.username} from friend list?</Text>
                    <View style={{flexDirection: 'row', }}>
                      <Button title="Delete" color={'red'} onPress={ () => deleteFriend(documentIds[index], setConfirmation)}/>
                    </View>
                </Overlay>
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
