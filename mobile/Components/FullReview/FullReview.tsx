import Colors from "@/Constants/Colors";
import { BookInfoWrapperContext } from "@/Contexts";
import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { useContext } from "react";
import { Text, View, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Divider } from "react-native-paper";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Account } from "appwrite";
import { client } from "@/appwrite";
import {
  BACKEND_API_CUSTOM_PROPERTY_DATA_URL,
  BACKEND_API_CUSTOM_PROPERTY_TEMPLATE_URL,
} from "@/Constants/URLs";

const account = new Account(client);

const fakeData = [
  { propertyName: "How many times I cried", value: "2" },
  { propertyName: "Favorite", value: "True" },
];

function FullReview({ route, navigation }) {
  const bookInfo = useContext(BookInfoWrapperContext);
  const { review } = route.params;
  const rating = review.rating / 4;
  const [properties, setProperties] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function getCustomPropertiesRaw() {
      try {
        const res = await fetch(
          `${BACKEND_API_CUSTOM_PROPERTY_DATA_URL}?` +
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
          return res_json.results.documents.map((property) => {
            return {
              template_id: property.template_id,
              value: property.value,
            };
          });
        } else {
          console.log("error getting raw property data: " + JSON.stringify(res_json));
        }
      } catch (error) {
        console.error(error);
        // setErrorMessage("An error occurred fetching the books.");
        // setErrorModalVisible(true);
      }
    }

    async function getCustomProperties() {
      let rawData = await getCustomPropertiesRaw();
      let processedData = [];
      for (let i = 0; i < rawData.length; i++) {
        const rawProperty = rawData[i];
        const res = await fetch(
          `${BACKEND_API_CUSTOM_PROPERTY_TEMPLATE_URL}/${rawProperty.template_id}`,
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
          processedData[i] = { propertyName: res_json.result.name, value: rawProperty.value };
        } else {
          console.log("did not updated: " + JSON.stringify(res_json));
        }
      }
      return processedData;
    }

    getCustomProperties()
      .then((data) => {
        setProperties(data);
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
    <ScrollView style={{ backgroundColor: "white" }}>
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
      <Text style={styles.title}>Review by {review.username}</Text>
      <Text style={styles.bookTitle}>{bookInfo.title}</Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          gap: 5,
          marginVertical: 10,
        }}
      >
        <Text style={{ fontSize: 20 }}>{rating}</Text>
        <FontAwesome name={"star"} color={Colors.BUTTON_PURPLE} size={25} />
      </View>
      {loading && (
        <ActivityIndicator
          size="large"
          color={Colors.BUTTON_PURPLE}
          style={{ marginTop: 5 }}
        />
      )}
      {properties.length != 0 && (
        <View>
          <Divider bold={true} horizontalInset={true} />
          <View style={{ marginBottom: 10 }}>
            {properties.map((item, index) => (
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  margin: 10,
                  marginBottom: 0,
                  marginLeft: 15,
                }}
                key={index}
              >
                <Text style={styles.propertyName}>{item.propertyName}</Text>
                <Text style={styles.value}>: {item.value}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
      <Divider bold={true} horizontalInset={true} />
      <Text style={{ margin: 15, marginTop: 10 }}>{review.desc}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    paddingHorizontal: 10,
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
  propertyName: {
    fontSize: 18,
    fontWeight: "500",
  },
  value: {
    fontSize: 18,
  },
});

export default FullReview;
