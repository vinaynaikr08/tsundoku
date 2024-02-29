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

async function getReviews(book_id: string) {
  let reviews = [];
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
      reviews.push({
        rating: review_data.star_rating,
        desc: review_data.description,
        username: review_data.user_id,
        id: document.$id,
      });
    }),
  );
  // console.log(reviews);
  return reviews;
}

export const BookInfoModalReview = ({ bookInfo }) => {
  const [reviews, setReviews] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      setReviews(await getReviews(bookInfo.id));
    })();
  }, []);
  console.log(reviews);
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
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 5 }}>
        Overall Rating:
      </Text>
      <View
        style={{
          flexDirection: "row",
          marginBottom: 40,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 30,
            fontWeight: "bold",
            marginRight: 12,
          }}
        >
          {/* {item.rating / 4} */}
        </Text>
        {createStars(40)}
      </View>
      <FlatList
        data={reviews}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.username}
        renderItem={
          ({ item }) => (
            //   return (
            <View style={{ flex: 1 }}>
              <TouchableOpacity activeOpacity={1}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={{ marginRight: 10 }}>
                    <Ionicons name={"person-circle"} color={"grey"} size={60} />
                  </View>
                  <View style={{ marginRight: 10 }}>
                    <Text style={{ fontSize: 20, marginBottom: 5 }}>
                      {item.username}
                    </Text>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      {createStars(30)}
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
                <View style={{ flexDirection: "row", alignItems: "center" }}>
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
                        color={thumbsUpClicked ? Colors.BUTTON_PURPLE : "grey"}
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
          )
          //   );
        }
      />
    </View>
  );
};

function createStars(size) {
  let stars = [];

  for (let i = 0; i < 5; i++) {
    stars.push(
      <FontAwesome
        key={i}
        name={"star"}
        color={Colors.BUTTON_PURPLE}
        size={size}
      />,
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
