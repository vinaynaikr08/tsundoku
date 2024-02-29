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

      reviews.push({
        rating: review_data.star_rating,
        desc: review_data.description,
        username: review_data.user_id,
        id: document.$id,
      });
    }),
  );
  avgRating = avgRating / reviews.length;
  // console.log(avgRating);

  return reviews;
}

export const BookInfoModalReview = ({ bookInfo }) => {
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

  return (
    <View style={{ flex: 1 }}>
      {reviews.length === 0 ? (
        <Text style={{ fontSize: 20, fontWeight: "bold", margin: 30 }}>
          No Reviews
        </Text>
      ) : (
        <View style={{ flex: 1 }}>
          <FlatList
            data={reviews}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.username}
            ListHeaderComponent={() => (
              <View
                style={{
                  flexDirection: "row",
                  margin: 20,
                  marginBottom: 30,
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                  Overall Rating: {(avgRating / 4).toFixed(2)}
                </Text>
                <FontAwesome
                  name={"star"}
                  color={Colors.BUTTON_PURPLE}
                  size={25}
                />
              </View>
            )}
            renderItem={
              ({ item }) => (
                //   return (
                <View style={{ flex: 1 }}>
                  <TouchableOpacity activeOpacity={1}>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
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
                    <Text
                      style={{
                        fontSize: 15,
                        margin: Dimensions.BOOK_INFO_MODAL_SUMMARY_MARGIN,
                      }}
                    >
                      {item.desc}
                    </Text>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
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
                              thumbsDownClicked
                                ? "thumbs-down"
                                : "thumbs-o-down"
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
              )
              //   );
            }
          />
        </View>
      )}
    </View>
  );
};

function createStars(rating, size) {
  let stars = [];

  for (let i = 0; i < 5; i++) {
    if (i > rating) {
      stars.push(
        <FontAwesome
          key={i}
          name={"star-o"}
          color={Colors.BUTTON_PURPLE}
          size={size}
        />,
      );
    } else {
      stars.push(
        <FontAwesome
          key={i}
          name={"star"}
          color={Colors.BUTTON_PURPLE}
          size={size}
        />,
      );
    }
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
