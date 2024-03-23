import { BACKEND_API_CUSTOM_PROPERTY_TEMPLATE_URL } from "@/Constants/URLs";
import * as React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Account } from "appwrite";
import { client } from "@/appwrite";
import Colors from "@/Constants/Colors";
import { ScrollView } from "react-native-gesture-handler";

const account = new Account(client);

function ViewCustomProperties() {
  const [properties, setProperties] = React.useState([]);

  React.useEffect(() => {
    async function getCustomProperty() {
      const user_id = (await account.get()).$id;
      try {
        const res = await fetch(
          `${BACKEND_API_CUSTOM_PROPERTY_TEMPLATE_URL}?` +
            new URLSearchParams({
              self: "true",
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
        return res_json.results.documents.map((property) => {
          return {
            name: property.name,
            type: property.type,
          };
        });
      } catch (error) {
        console.error(error);
        // setErrorMessage("An error occurred fetching the books.");
        // setErrorModalVisible(true);
      }
    }

    getCustomProperty()
      .then((data) => {
        setProperties(data);
      })
      .catch((error) => {
        console.error(error);
        // setErrorMessage("An error occurred fetching the recommended books.");
        // setErrorModalVisible(true);
      });
  }, []);
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white" }} >
      <Text style={styles.title}>Your Custom Properties</Text>
      {properties && (
        <View>
          <View style={{ marginBottom: 20 }}>
            {properties.map((item, index) => (
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  margin: 20,
                  marginBottom: 0,
                  marginLeft: 15,
                  justifyContent: "center",
                  padding: 20,
                  backgroundColor: "white",
                  shadowColor: "gray",
                  shadowOffset: { width: 1, height: 1 },
                  shadowOpacity: 0.2,
                  shadowRadius: 6,
                  elevation: 5,
                  borderRadius: 10,
                }}
                key={index}
              >
                <View>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.type}>{item.type.toLowerCase()}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    paddingHorizontal: 10,
    marginTop: 20,
  },
  bookTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginHorizontal: 40,
    textAlign: "center",
    paddingHorizontal: 10,
    marginTop: 10,
    color: Colors.BUTTON_PURPLE,
  },
  name: {
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
    color: Colors.BUTTON_PURPLE,
  },
  type: {
    fontSize: 18,
    textAlign: "center",
    textTransform: "capitalize",
  },
});

export default ViewCustomProperties;
