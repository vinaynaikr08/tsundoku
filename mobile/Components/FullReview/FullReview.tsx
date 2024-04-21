import Backend from "@/Backend";
import Colors from "@/Constants/Colors";
import { BACKEND_API_CUSTOM_PROPERTY_TEMPLATE_URL } from "@/Constants/URLs";
import { BookInfoWrapperContext } from "@/Contexts";
import { client } from "@/appwrite";
import { Account } from "appwrite";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Divider } from "react-native-paper";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import useSWR from "swr";

const account = new Account(client);
const backend = new Backend();

function FullReview({ route, navigation }) {
  const { review_id } = route.params;
  const [isSelfReview, setIsSelfReview] = React.useState<boolean>(false);

  const reviewSWR = useSWR(
    { func: backend.getReview, arg: review_id },
    backend.swrFetcher,
  );

  React.useEffect(() => {
    (async () => {
      if (reviewSWR.data) {
        const user_id = await backend.getUserId();
        setIsSelfReview(reviewSWR.data.user_id === user_id);
      }
    })();
  }, [reviewSWR.data]);

  if (reviewSWR.isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <ActivityIndicator />
      </View>
    );
  }

  console.log(reviewSWR.data);

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
      <Text style={styles.title}>Review by {reviewSWR.data.username}</Text>
      <Text style={styles.bookTitle}>{reviewSWR.data.book.title}</Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          gap: 5,
          marginVertical: 10,
        }}
      >
        <Text style={{ fontSize: 20 }}>{reviewSWR.data.star_rating / 4}</Text>
        <FontAwesome name={"star"} color={Colors.BUTTON_PURPLE} size={25} />
      </View>
      {isSelfReview && <CustomProperties book_id={reviewSWR.data.book.$id} />}
      <Divider bold={true} horizontalInset={true} />
      {reviewSWR.data.description ? (
        <Text style={{ margin: 15, marginTop: 10 }}>
          {reviewSWR.data.description}
        </Text>
      ) : (
        <Text style={{margin: 15, color: "gray"}}>This review has no description.</Text>
      )}
    </ScrollView>
  );
}

interface CustomPropertyEntry {
  propertyName: string;
  value: string;
}

function CustomProperties({ book_id }: { book_id: string }) {
  const [properties, setProperties] = React.useState<
    CustomPropertyEntry[] | null
  >(null);

  React.useEffect(() => {
    async function getCustomPropertyData() {
      const rawData = await backend.getCustomProperties(book_id);
      const processedData = [];
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
          processedData[i] = {
            propertyName: res_json.result.name,
            value: rawProperty.value,
          };
        } else {
          console.log("did not updated: " + JSON.stringify(res_json));
        }
      }

      return processedData;
    }

    getCustomPropertyData().then((data) => {
      setProperties(data);
    });
  }, []);

  if (properties == null) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          margin: 30,
          alignItems: "center",
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Text>Loading custom properties... </Text>
          <ActivityIndicator />
        </View>
      </View>
    );
  }

  return (
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
