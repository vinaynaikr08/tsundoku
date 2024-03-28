import * as React from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { BACKEND_API_URL } from "@/Constants/URLs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Colors from "../../Constants/Colors";
import Dimensions from "../../Constants/Dimensions";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useState } from "react";
import { Account, Databases, Query } from "appwrite";
import { client } from "@/appwrite";
import ID from "@/Constants/ID";

const Tab = createMaterialTopTabNavigator();

const account = new Account(client);
const databases = new Databases(client);
let avgRating = 0;

async function getReviews(book_id: string) {
  let reviews = [];
  avgRating = 0;
  let documents = (
    await databases.listDocuments(ID.mainDBID, ID.reviewsCollectionID, [
      Query.equal("book", book_id),
    ])
  ).documents;

  await Promise.all(
    documents.map(async (document) => {
      const review_data = await databases.getDocument(
        ID.mainDBID,
        ID.reviewsCollectionID,
        document.$id,
      );
      avgRating += review_data.star_rating;
      const response = await fetch(
        `${BACKEND_API_URL}/v0/users/${review_data.user_id}/name`,
        {
          method: "GET",
          headers: new Headers({
            "Content-Type": "application/json",
            Authorization: "Bearer " + (await account.createJWT()).jwt,
          }),
        },
      );
      const { name } = await response.json();
      reviews.push({
        rating: review_data.star_rating,
        desc: review_data.description,
        username: name,
        id: document.$id,
      });
    }),
  );
  avgRating = avgRating / reviews.length;

  return reviews;
}

export const BookInfoModalReview = ({ bookInfo, navigation }) => {
  const [reviews, setReviews] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      setReviews(await getReviews(bookInfo.id));
    })();
  }, []);
  const [thumbsUpClicked, setThumbsUpClicked] = useState(false);
  const [thumbsDownClicked, setThumbsDownClicked] = useState(false);

  const handleThumbsUpClick = () => {
    setThumbsUpClicked(!thumbsUpClicked);
    if (thumbsDownClicked) {
      setThumbsDownClicked(false);
    }
  };
  const handleThumbsDownClick = () => {
    setThumbsDownClicked(!thumbsDownClicked);
    if (thumbsUpClicked) {
      setThumbsUpClicked(false);
    }
  };

  const renderReviewDescription = (desc) => {
    if (desc.length > 200) {
      return (
        <>
          <Text
            style={{
              fontSize: 15,
              margin: Dimensions.BOOK_INFO_MODAL_SUMMARY_MARGIN,
            }}
          >
            {desc.substring(0, 200)}...
            <Text style={{ color: "#a3a3a3" }}> Read more</Text>
          </Text>
        </>
      );
    } else {
      return (
        <Text
          style={{
            fontSize: 15,
            margin: Dimensions.BOOK_INFO_MODAL_SUMMARY_MARGIN,
          }}
        >
          {desc}
        </Text>
      );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {reviews.length === 0 ? (
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            margin: 30,
            color: "grey",
          }}
        >
          No Reviews
        </Text>
      ) : (
        <View style={{ flex: 1, paddingBottom: 330 }}>
          <FlatList
            data={reviews}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.username}
            ListHeaderComponent={() => (
              <View
                style={{
                  flexDirection: "row",
                  marginVertical: 30,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ fontSize: 20, fontWeight: "bold", marginRight: 5 }}
                >
                  Overall Rating: {(avgRating / 4).toFixed(2)}
                </Text>
                <FontAwesome
                  name={"star"}
                  color={Colors.BUTTON_PURPLE}
                  size={25}
                />
              </View>
            )}
            renderItem={({ item }) => (
              <View style={{ flex: 1 }}>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() =>
                    navigation.navigate("bookInfoFullReview", { review: item })
                  }
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View style={{ marginRight: 10 }}>
                      <Ionicons
                        name={"person-circle"}
                        color={"grey"}
                        size={60}
                      />
                    </View>
                    <View style={{ marginRight: 10 }}>
                      <Text style={{ fontSize: 20, marginBottom: 5 }}>
                        {item.username}
                      </Text>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        {createStars(item.rating / 4, 30)}
                      </View>
                    </View>
                  </View>
                  {renderReviewDescription(item.desc)}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 30,
                    }}
                  >
                    <TouchableOpacity onPress={handleThumbsUpClick}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginLeft: 10,
                          marginTop: 10,
                        }}
                      >
                        <FontAwesome
                          name={thumbsUpClicked ? "thumbs-up" : "thumbs-o-up"}
                          color={
                            thumbsUpClicked ? Colors.BUTTON_PURPLE : "grey"
                          }
                          size={30}
                        />
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleThumbsDownClick}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginLeft: 20,
                        }}
                      >
                        <FontAwesome
                          name={
                            thumbsDownClicked ? "thumbs-down" : "thumbs-o-down"
                          }
                          color={
                            thumbsDownClicked ? Colors.BUTTON_PURPLE : "grey"
                          }
                          size={30}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};

function createStars(rating, size) {
  let stars = [];

  for (let i = 0; i < 5; i++) {
    stars.push(
      <View key={i} style={{ marginRight: 3 }}>
        {i < rating ? (
          <FontAwesome name={"star"} color={Colors.BUTTON_PURPLE} size={size} />
        ) : (
          <FontAwesome
            name={"star-o"}
            color={Colors.BUTTON_PURPLE}
            size={size}
          />
        )}
      </View>,
    );
  }
  return stars;
}

export default BookInfoModalReview;

const styles = StyleSheet.create({
  scrollViewStyle: {
    paddingBottom: 330,
    marginBottom: 100,
    paddingHorizontal: 5,
    backgroundColor: "white",
  },
});
