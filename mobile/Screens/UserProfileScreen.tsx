import React, {useState} from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { client } from "../appwrite";
import { Databases, Account, Query } from "appwrite";
import { NavigationContext, ProfileContext } from "../Contexts";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileTabs from "@/Components/ProfileTabs/ProfileTabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import LibraryCarouselTabs from "@/Components/LibraryCarousel/LibraryCarouselTabs";
import ID from "../Constants/ID";
import Colors from "@/Constants/Colors";
import { ActivityIndicator } from "react-native-paper";
import { ID as UID }  from  "appwrite" ;
import { Permission, Role } from "appwrite";
import Toast from "react-native-toast-message";
import { Overlay, Button } from "@rneui/base";


const databases = new Databases(client);

function userPermissions(user_id: string) {
  return [
    Permission.read(Role.user(user_id)),
    Permission.update(Role.user(user_id)),
    Permission.delete(Role.user(user_id)),
  ];
}

function handleOnClick(user_id, setStatus, status, setButton, setShowMenu, setShowDeleteOption) {
  switch (status) {
    case (0): 
      // Send Friend Request
      sendFriendRequest(user_id, setStatus, setButton);
      break;
    case (1):
      // Delete Friend
      setShowDeleteOption(true);
      break;
    case (2):
      // Friend Request Sent
      deleteFriend(user_id, status, setStatus, setButton);
      break;
    case (3):
      // Friend Request Incoming
      setShowMenu(true);
      break;
  }
}

async function sendFriendRequest(user_id, setStatus, setButton) {
  const account = new Account(client);
  const current_user_id =  (await account.get()).$id;
  const promise = databases.createDocument(
    ID.mainDBID,
    ID.friendsCollectionID,
    UID.unique(),
    {
      requester: current_user_id,
      requestee: user_id,
      status: "PENDING"
    },
    userPermissions(current_user_id),
  );

  promise.then(function (response) {
    console.log(response); // Success
    // pending out
    setStatus(2);
    setButton("Friend Request Sent") 
    Toast.show({
      type: "success",
      text1: "Friend Request Sent",
      position: "bottom",
      visibilityTime: 2000,
    });
  }, function (error) {
      console.log(error); // Failure
  });
}

async function deleteFriend(user_id, status, setStatus, setButton) {
  const account = new Account(client);
  account
    .get()
    .then((response) => {
      const current_user_id = response.$id;
      const promise = databases.listDocuments(
        ID.mainDBID,
        ID.friendsCollectionID,
        [
          Query.or([
            Query.and([
              Query.equal("requester", current_user_id),
              Query.equal("requestee", user_id),
            ]),
            Query.and([
              Query.equal("requester", user_id),
              Query.equal("requestee", current_user_id),
            ]),
          ])
          
        ],
      );
      promise.then(function (response) {
        const documents = response.documents;
        const doc_id = documents[0].$id;
        const promise_1 = databases.deleteDocument(
          ID.mainDBID,
          ID.friendsCollectionID,
          doc_id,
        );
        promise_1.then(function (response_1) {
          console.log(response_1); // Success
          switch (status) {
            case 1:
              Toast.show({
                type: "success",
                text1: "Friend Removed",
                position: "bottom",
                visibilityTime: 2000,
              });
              break;
            case 2:
              Toast.show({
                type: "success",
                text1: "Friend Request Cancelled",
                position: "bottom",
                visibilityTime: 2000,
              });
              break;
            case 3:
              Toast.show({
                type: "success",
                text1: "Friend Request Declined",
                position: "bottom",
                visibilityTime: 2000,
              });
              break;
          }
          // no status
          setStatus(0);
          setButton("Send Friend Request");
          
        }, function (error) {
            console.log(error); // Failure
        });
      });
    });
}

async function acceptFriend(user_id, setStatus, setButton) {
  const account = new Account(client);
  account
    .get()
    .then((response) => {
      const current_user_id = response.$id;
      const promise = databases.listDocuments(
        ID.mainDBID,
        ID.friendsCollectionID,
        [
          Query.or([
            Query.and([
              Query.equal("requester", current_user_id),
              Query.equal("requestee", user_id),
            ]),
            Query.and([
              Query.equal("requester", user_id),
              Query.equal("requestee", current_user_id),
            ]),
          ])
          
        ],
      );
      promise.then(function (response) {
        const documents = response.documents;
        const doc_id = documents[0].$id;
        const promise_1 = databases.updateDocument(
          ID.mainDBID,
          ID.friendsCollectionID,
          doc_id,
          {
            status: "ACCEPTED",
          }
        );
        promise_1.then(function (response_1) {
          console.log(response_1); // Success
          // friends
          setStatus(1);
          setButton("Delete Friend");
          Toast.show({
            type: "success",
            text1: "Friend Request Accepted",
            position: "bottom",
            visibilityTime: 2000,
          });
        }, function (error) {
            console.log(error); // Failure
        });
      });
    });
}

export const UserProfile = ({ navigation, route }) => {
  const { username, user_id } = route.params;
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(0);
  const [button, setButton] = useState("");
  const [friend, setFriend] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteOption, setShowDeleteOption] = useState(false);

  React.useEffect(() => {
    const account = new Account(client);
    account
      .get()
      .then((response) => {
        const current_user_id = response.$id;
        const promise = databases.listDocuments(
          ID.mainDBID,
          ID.friendsCollectionID,
          [
            Query.or([
              Query.and([
                Query.equal("requester", current_user_id),
                Query.equal("requestee", user_id),
              ]),
              Query.and([
                Query.equal("requester", user_id),
                Query.equal("requestee", current_user_id),
              ]),
            ])
            
          ],
        );
        promise.then(function (response) {
          const documents = response.documents;
          if (documents.length == 0) {
            // no status
            setStatus(0);
          } else {
            if (documents[0].status == "ACCEPTED") {
              // friends
              setStatus(1);
            } else if (documents[0].requester == current_user_id) {
              // pending out
              setStatus(2);
            } else {
              // pending in
              setStatus(3);
            }
          }
        });
      });
    switch (status) {
      case (0): 
        setButton("Send Friend Request");
        break;
      case (1):
        setButton("Delete Friend");
        setFriend(true);
        break;
      case (2):
        setButton("Friend Request Sent");
        break;
      case (3):
        setButton("Friend Request Incoming");
        break;
    }
    setLoading(false);
  }, []);

  return (
    <NavigationContext.Provider value={navigation}>
      {loading ? <ActivityIndicator/> :
      <SafeAreaView style={{ flexGrow: 1, backgroundColor: "white" }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View>
            <TouchableOpacity
              style={{
                margin: 15,
                marginBottom: 10,
                marginLeft: 10,
                alignSelf: "flex-start",
              }}
              onPress={() => navigation.pop()}
            >
              <Ionicons name={"chevron-back"} color="black" size={25} />
            </TouchableOpacity>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  marginLeft: 20,
                  marginBottom: 15,
                  marginTop: 5,
                  fontWeight: "700",
                  fontSize: 21,
                }}
              >
                {username}
              </Text>

              {friend && <View>
                <Text style={{color: "green"}}>friend</Text>
              </View>}

              <View style={{alignItems: 'flex-start'}}>
                <View style={{ backgroundColor: friend ? 'red' : Colors.BUTTON_PURPLE, borderColor: 'gray', borderWidth: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 10, marginBottom: 20, marginLeft: 20}}>
                  <TouchableOpacity style={{padding: 10, paddingLeft: 15, paddingRight: 15}} onPress={() => handleOnClick(user_id, setStatus, status, setButton, setShowMenu, setShowDeleteOption)}>
                    <Text style={{color: 'white'}}>{button}</Text>
                  </TouchableOpacity> 
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <LibraryCarouselTabs user_id={user_id} />
        <Overlay
          isVisible={showMenu}
          onBackdropPress={() => setShowMenu(false)}
          overlayStyle={{backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', width: '70%', height: '20%', borderRadius: 10}}
        >
          <Text style={{fontSize: 20, paddingBottom: 10}}>Accept Friend Request?</Text>
          <View style={{flexDirection: 'row', }}>
            <Button title="Accept" color={'green'} style={{marginRight: 10}} onPress={ () => acceptFriend(user_id, setStatus, setButton)}/>
            <Button title="Decline" color={'red'} onPress={ () => deleteFriend(user_id, status, setStatus, setButton)}/>
          </View>
        </Overlay>
        
        <Overlay
          isVisible={showDeleteOption}
          onBackdropPress={() => setShowDeleteOption(false)}
          overlayStyle={{backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', width: '60%', height: '20%', borderRadius: 10}}
        >
          <Text style={{fontSize: 20, paddingBottom: 10}}>Delete Friend?</Text>
          <View style={{flexDirection: 'row', }}>
            <Button title="Delete" color={'red'} onPress={ () => deleteFriend(user_id, status, setStatus, setButton)}/>
          </View>
        </Overlay>
        
      </SafeAreaView>}
    </NavigationContext.Provider>
  );
};
