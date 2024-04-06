import Colors from "@/Constants/Colors";
import * as React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { client } from "@/appwrite";
import { Account } from "appwrite";
import { BACKEND_API_PRIVATE_NOTES } from "@/Constants/URLs";

const account = new Account(client);

interface NoteData {
  note: string;
  id: string;
}

function PrivateNotes({ navigation, bookInfo }) {
  const [privateNote, setPrivateNote] = React.useState<NoteData>({
    note: "",
    id: "",
  });
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    async function getPrivateNote() {
      try {
        const res = await fetch(
          `${BACKEND_API_PRIVATE_NOTES}?` +
            new URLSearchParams({
              book_id: bookInfo.id,
            }),
          {
            method: "get",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: "Bearer " + (await account.createJWT()).jwt,
            }),
          },
        );

        const res_json = await res.json();
        if (res.ok) {
          if (res_json.results.documents.length == 0) {
            return { note: "null", id: "null" };
          } else {
            return {
              note: res_json.results.documents[0].notes,
              id: res_json.results.documents[0].$id,
            };
          }
        } else {
          console.log(
            "error getting raw property data: " + JSON.stringify(res_json),
          );
        }
      } catch (error) {
        console.error(error);
        // setErrorMessage("An error occurred fetching the books.");
        // setErrorModalVisible(true);
      }
    }

    getPrivateNote()
      .then((data) => {
        if (data) {
          setPrivateNote(data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        // setErrorMessage("An error occurred fetching the recommended books.");
        // setErrorModalVisible(true);
      });
  }, []);

  return (
    <ScrollView style={{ backgroundColor: "white", marginTop: 10 }}>
      {privateNote.note == "null" && (
        <Text style={{ marginBottom: 10, alignSelf: "center" }}>
          You have no private notes!
        </Text>
      )}
      {privateNote.note != "null" && <Text>{privateNote.note}</Text>}
      <Pressable
        onPress={() =>
          navigation.navigate("EditPrivateNotes", {
            noteId: privateNote.note == "null" ? null : privateNote.id,
          })
        }
        style={styles.saveButton}
      >
        <Text style={styles.saveButtonText}>Edit</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  saveButton: {
    backgroundColor: Colors.BUTTON_PURPLE,
    padding: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderRadius: 10,
    width: "25%",
    alignSelf: "center",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
});

export default PrivateNotes;
