import Backend from "@/Backend";
import LibraryCarouselTabs from "@/Components/LibraryCarousel/LibraryCarouselTabs";
import Colors from "@/Constants/Colors";
import { Button, Overlay } from "@rneui/base";
import {
  Account,
  Databases,
  Permission,
  Query,
  Role,
  ID as UID,
} from "appwrite";
import React, { useEffect, useReducer, useState } from "react";
import {
  Keyboard,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Linking,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import Ionicons from "react-native-vector-icons/Ionicons";
import ID from "../Constants/ID";
import { NavigationContext } from "../Contexts";
import { client } from "../appwrite";
import { BACKEND_API_USER_ABOUT_ME, BACKEND_API_SOCIAL_URLS } from "@/Constants/URLs";

const databases = new Databases(client);
const backend = new Backend();

function userPermissions(user_id: string) {
  return [
    Permission.read(Role.user(user_id)),
    Permission.update(Role.user(user_id)),
    Permission.delete(Role.user(user_id)),
  ];
}

function handleOnClick(
  user_id,
  setStatus,
  status,
  setButton,
  setShowMenu,
  setShowDeleteOption,
  setDisabled,
) {
  setDisabled(true);
  switch (status) {
    case 0:
      // Send Friend Request
      sendFriendRequest(user_id, setStatus, setButton, setDisabled);
      break;
    case 1:
      // Delete Friend
      setShowDeleteOption(true);
      break;
    case 2:
      // Friend Request Sent
      deleteFriend(user_id, status, setStatus, setButton, setDisabled);
      break;
    case 3:
      // Friend Request Incoming
      setShowMenu(true);
      break;
  }
}

async function sendFriendRequest(user_id, setStatus, setButton, setDisabled) {
  const account = new Account(client);
  const info = await account.get();
  const current_user_id = info.$id;
  const name = info.name;
  try {
    const rest = await databases.listDocuments(
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
        ]),
      ],
    );

    if (rest.documents.length !== 0) {
      Toast.show({
        type: "error",
        text1: "Already Friends or Pending Request",
        position: "bottom",
        visibilityTime: 2000,
      });
      setDisabled(false);
      return;
    }

    const promise = databases.createDocument(
      ID.mainDBID,
      ID.friendsCollectionID,
      UID.unique(),
      {
        requester: current_user_id,
        requestee: user_id,
        status: "PENDING",
      },
      userPermissions(current_user_id),
    );

    promise.then(
      function (response) {
        // Success
        // pending out
        setStatus(2);
        setButton("Friend Request Sent");
        Toast.show({
          type: "success",
          text1: "Friend Request Sent",
          position: "bottom",
          visibilityTime: 2000,
        });
        // get notification settings
        try {
          const promise = databases.listDocuments(
            ID.mainDBID,
            ID.notificationsCollectionID,
            [Query.equal("user_id", user_id)],
          );

          promise
            .then(function (response) {
              const documents = response.documents;
              if (documents.length == 0) {
                const promise1 = databases.createDocument(
                  ID.mainDBID,
                  ID.notificationsCollectionID,
                  UID.unique(),
                  {
                    user_id: user_id,
                    general: true,
                    new_follower: true,
                    friend_reading_status_update: true,
                  },
                );
                backend.sendNotification(
                  user_id,
                  "friend_req",
                  "Friend Request",
                  name + " has sent you a friend request!",
                );
              } else {
                if (documents[0].general && documents[0].new_follower) {
                  backend.sendNotification(
                    user_id,
                    "friend_req",
                    "Friend Request",
                    name + " has sent you a friend request!",
                  );
                }
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } catch (error) {
          console.log(error);
        }
        setDisabled(false);
      },
      function (error) {
        console.log(error); // Failure
        setDisabled(false);
      },
    );
  } catch (error) {
    console.error(error);
    setDisabled(false);
  }
}

async function deleteFriend(
  user_id,
  status,
  setStatus,
  setButton,
  setDisabled,
  setFriend?,
) {
  const account = new Account(client);
  account.get().then((response) => {
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
        ]),
      ],
    );
    promise
      .then(function (response) {
        const documents = response.documents;
        let promise_1 = null;
        try {
          const doc_id = documents[0].$id;
          promise_1 = databases.deleteDocument(
            ID.mainDBID,
            ID.friendsCollectionID,
            doc_id,
          );
        } catch (error) {
          Toast.show({
            type: "error",
            text1: "Friend Request was Removed",
            position: "bottom",
            visibilityTime: 2000,
          });
          setDisabled(false);
          return;
        }

        promise_1.then(
          function (response_1) {
            // Success
            switch (status) {
              case 1:
                Toast.show({
                  type: "success",
                  text1: "Friend Removed",
                  position: "bottom",
                  visibilityTime: 2000,
                });
                setFriend(false);
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
            setDisabled(false);

            // no status
            setStatus(0);
            setButton("Send Friend Request");
          },
          function (error) {
            console.log(error); // Failure
            setDisabled(false);
          },
        );
      })
      .catch((error) => {
        Toast.show({
          type: "error",
          text1: "Friend Request was Removed",
          position: "bottom",
          visibilityTime: 2000,
        });
        setDisabled(false);
      });
  });
}

async function acceptFriend(
  user_id,
  setStatus,
  setButton,
  setFriend,
  setDisabled,
) {
  const account = new Account(client);
  account.get().then((response) => {
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
        ]),
      ],
    );
    promise.then(function (response) {
      const documents = response.documents;
      let promise_1 = null;
      try {
        const doc_id = documents[0].$id;
        promise_1 = databases.updateDocument(
          ID.mainDBID,
          ID.friendsCollectionID,
          doc_id,
          {
            status: "ACCEPTED",
          },
        );
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Friend Request was Removed",
          position: "bottom",
          visibilityTime: 2000,
        });
        setDisabled(false);
        return;
      }
      promise_1.then(
        function (response_1) {
          // Success
          // friends
          setDisabled(false);
          setStatus(1);
          setFriend(true);
          setButton("Delete Friend");
          Toast.show({
            type: "success",
            text1: "Friend Request Accepted",
            position: "bottom",
            visibilityTime: 2000,
          });
        },
        function (error) {
          console.log(error); // Failure
        },
      );
    });
  });
}

async function getBio(userId) {
  const account = new Account(client);
  try {
    const res = await fetch(
      `${BACKEND_API_USER_ABOUT_ME}?` +
        new URLSearchParams({
          user_id: userId,
        }),
      {
        method: "GET",
        headers: new Headers({
          "Content-Type": "application/json",
          // Authorization: "Bearer " + (await account.createJWT()).jwt,
        }),
      },
    );
    if (res.ok) {
      const res_json = await res.json();
      return res_json.about_me_bio;
    } else {
      console.error("Error fetching bio:", res.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error fetching bio:", error);
    return null;
  }
}

async function getSocial(userId : string) {
  try {
    const res = await fetch(`${BACKEND_API_SOCIAL_URLS}` + '?' +
      new URLSearchParams({
        user_id: userId,
      }),
    {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json",
        // Authorization: "Bearer " + (await account.createJWT()).jwt,
      }),
    });
    const res_json = await res.json();
    return res_json.social_url;
  } catch (error) {
    console.log("Error fetching socials:", error);
  }
}

export const UserProfile = ({ navigation, route }) => {
  const [update, forceUpdate] = useReducer((x) => x + 1, 0);
  const { username, user_id } = route.params;
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(0);
  const [button, setButton] = useState("");
  const [bio, setBio] = useState("");
  const [social, setSocial] = useState("");
  const [friend, setFriend] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteOption, setShowDeleteOption] = useState(false);
  const [disabled, setDisabled] = useState(false);
  React.useEffect(() => {
    console.log("updated");
    const account = new Account(client);
    let status_1 : number;
    account.get().then((response) => {
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
          ]),
        ],
      );

      promise
        .then(function (response) {
          const documents = response.documents;
          if (documents.length == 0) {
            // no status
            status_1 = 0;
          } else {
            if (documents[0].status == "ACCEPTED") {
              // friends
              status_1 = 1;
            } else if (documents[0].requester == current_user_id) {
              // pending out
              status_1 = 2;
            } else {
              // pending in
              status_1 = 3;
            }
          }
        })
        .then(() => {
          setStatus(status_1);
          setFriend(false);
          switch (status_1) {
            case 0:
              setButton("Send Friend Request");
              break;
            case 1:
              setButton("Delete Friend");
              setFriend(true);
              break;
            case 2:
              setButton("Friend Request Sent");
              break;
            case 3:
              setButton("Friend Request Incoming");
              break;
          }
          setLoading(false);
        })
        .catch((error) => console.log(error));
    });
  }, [update]);

  useEffect(() => {
    (async () => {
      const fetchedBio = await getBio(user_id);
      if (fetchedBio !== null) {
        setBio(fetchedBio);
      }
      setSocial(await getSocial(user_id));
      setLoading(false);
    })();
  }, [user_id]);

  return (
    <NavigationContext.Provider value={navigation}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <SafeAreaView style={{ flexGrow: 1, backgroundColor: "white" }}>
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
          >
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
              <View>
                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={{
                      marginLeft: 20,
                      marginBottom: 5,
                      marginTop: 5,
                      fontWeight: "700",
                      fontSize: 21,
                    }}
                  >
                    {username}
                  </Text>

                  {friend && (
                    <View>
                      <Text style={{ color: "green" }}>friend</Text>
                    </View>
                  )}
                </View>

                <View style={{ alignItems: "flex-start" }}>
                  <View
                    style={{
                      backgroundColor: friend ? "red" : Colors.BUTTON_PURPLE,
                      borderColor: "gray",
                      borderWidth: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 10,
                      marginBottom: 20,
                      marginLeft: 20,
                    }}
                  >
                    <TouchableOpacity
                      disabled={disabled}
                      style={{ padding: 10, paddingLeft: 15, paddingRight: 15 }}
                      onPress={() => {
                        forceUpdate();
                        handleOnClick(
                          user_id,
                          setStatus,
                          status,
                          setButton,
                          setShowMenu,
                          setShowDeleteOption,
                          setDisabled,
                        );
                      }}
                    >
                      <Text style={{ color: "white" }}>{button}</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={{ marginLeft: 20, marginBottom: 10 }}>
                    About Me:{" "}
                    {bio ? bio : <Text style={{ color: "grey" }}>none</Text>}
                  </Text>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={{ marginLeft: 20, marginBottom: 10 }}>
                      Social Url:{" "}
                    </Text>
                    <Text style={{ marginBottom: 10 }} onPress={async () => {
                      if (social) {
                        await Linking.openURL(social);
                      }
                    }}>
                      {social ? <Text style={{ color: "blue" }}>{social}</Text> : <Text style={{ color: "grey" }}>none</Text>}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
          {friend ? (
            <LibraryCarouselTabs user_id={user_id} />
          ) : (
            <View style={{ paddingLeft: 20 }}>
              <Text>You must be friends to view the other person's shelf!</Text>
            </View>
          )}
          <Overlay
            isVisible={showMenu}
            onBackdropPress={() => {
              setShowMenu(false);
              setDisabled(false);
            }}
            overlayStyle={{
              backgroundColor: "white",
              alignItems: "center",
              justifyContent: "center",
              width: "60%",
              height: "15%",
              borderRadius: 10,
            }}
          >
            <Text style={{ fontSize: 20, paddingBottom: 10 }}>
              Accept Friend Request?
            </Text>
            <View style={{ flexDirection: "row" }}>
              <Button
                title="Accept"
                color={"green"}
                style={{ marginRight: 10 }}
                onPress={() => {
                  acceptFriend(
                    user_id,
                    setStatus,
                    setButton,
                    setFriend,
                    setDisabled,
                  );
                  setShowMenu(false);
                  forceUpdate();
                }}
              />
              <Button
                title="Decline"
                color={"red"}
                onPress={() => {
                  deleteFriend(
                    user_id,
                    status,
                    setStatus,
                    setButton,
                    setDisabled,
                  );
                  setShowMenu(false);
                  forceUpdate();
                }}
              />
            </View>
          </Overlay>

          <Overlay
            isVisible={showDeleteOption}
            onBackdropPress={() => {
              setShowDeleteOption(false);
              setDisabled(false);
            }}
            overlayStyle={{
              backgroundColor: "white",
              alignItems: "center",
              justifyContent: "center",
              width: "50%",
              height: "15%",
              borderRadius: 10,
            }}
          >
            <Text style={{ fontSize: 20, paddingBottom: 10 }}>
              Delete Friend?
            </Text>
            <View style={{ flexDirection: "row" }}>
              <Button
                title="Delete"
                color={"red"}
                onPress={() => {
                  deleteFriend(
                    user_id,
                    status,
                    setStatus,
                    setButton,
                    setDisabled,
                    setFriend,
                  );
                  setShowDeleteOption(false);
                  forceUpdate();
                }}
              />
            </View>
          </Overlay>
        </SafeAreaView>
      )}
    </NavigationContext.Provider>
  );
};
