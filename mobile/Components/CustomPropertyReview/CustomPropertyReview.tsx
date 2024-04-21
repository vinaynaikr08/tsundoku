import Colors from "@/Constants/Colors";
import {
  BACKEND_API_CUSTOM_PROPERTY_CATEGORIES_URL,
  BACKEND_API_CUSTOM_PROPERTY_TEMPLATE_URL,
} from "@/Constants/URLs";
import { client } from "@/appwrite";
import { Account } from "appwrite";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const account = new Account(client);

function PropertyInput({ property, propertyData, setPropertyData, index }) {
  let newProperty;
  const [categories, setCategories] = React.useState([]);
  const booleanCategories = ["true", "false"];
  const handleInputChange = (value: string) => {
    const newPropertyData = [...propertyData];
    if (index >= newPropertyData.length) {
      newPropertyData.push({ template_id: property.id, value: value });
    } else {
      newPropertyData[index] = { template_id: property.id, value: value };
    }
    setPropertyData(newPropertyData);
  };

  if (property.type == "NUMERICAL") {
    return (
      <View>
        <Text style={styles.propertyInput}>{property.name}</Text>
        <TextInput
          style={styles.categoryInput}
          onChangeText={(value) => handleInputChange(value)}
          value={newProperty}
          placeholder="Input a number"
          placeholderTextColor={Colors.BUTTON_TEXT_GRAY}
        />
      </View>
    );
  } else if (property.type == "BOOLEAN") {
    return (
      <View>
        <Text style={styles.propertyInput}>{property.name}</Text>
        <SelectDropdown
          data={booleanCategories}
          onSelect={(selectedItem, index) => {
            handleInputChange(selectedItem);
          }}
          dropdownOverlayColor={"transparent"}
          renderButton={(selectedItem, isOpen) => {
            return (
              <View style={styles.dropdown4BtnStyle}>
                <Icon
                  name={
                    isOpen
                      ? "chevron-up-circle-outline"
                      : "chevron-down-circle-outline"
                  }
                  color={Colors.BUTTON_PURPLE}
                  size={25}
                />
                <Text style={{ fontSize: 14, color: Colors.BUTTON_TEXT_GRAY }}>
                  {selectedItem || "Select true or false"}
                </Text>
              </View>
            );
          }}
          renderItem={(item, index, isSelected) => {
            return (
              <View style={styles.dropdownItemStyle}>
                <Text style={styles.dropdownButtonTxtStyle}>{item}</Text>
              </View>
            );
          }}
        />
      </View>
    );
  } else {
    React.useEffect(() => {
      async function getCategories() {
        try {
          const res = await fetch(
            `${BACKEND_API_CUSTOM_PROPERTY_CATEGORIES_URL}?` +
              new URLSearchParams({
                template_id: property.id,
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
            return res_json.results.values;
          } else {
            console.log("error: " + JSON.stringify(res_json));
          }
        } catch (error) {
          console.error(error);
          // setErrorMessage("An error occurred fetching the books.");
          // setErrorModalVisible(true);
        }
      }

      getCategories()
        .then((data) => {
          setCategories(data);
        })
        .catch((error) => {
          console.error(error);
          // setErrorMessage("An error occurred fetching the recommended books.");
          // setErrorModalVisible(true);
        });
    }, []);

    return (
      <View>
        <Text style={styles.propertyInput}>{property.name}</Text>
        <SelectDropdown
          data={categories}
          onSelect={(selectedItem, index) => {
            handleInputChange(selectedItem);
          }}
          dropdownOverlayColor={"transparent"}
          renderButton={(selectedItem, isOpen) => {
            return (
              <View style={styles.dropdown4BtnStyle}>
                <Icon
                  name={
                    isOpen
                      ? "chevron-up-circle-outline"
                      : "chevron-down-circle-outline"
                  }
                  color={Colors.BUTTON_PURPLE}
                  size={25}
                />
                <Text style={{ fontSize: 14, color: Colors.BUTTON_TEXT_GRAY }}>
                  {selectedItem || "Select category"}
                </Text>
              </View>
            );
          }}
          renderItem={(item, index, isSelected) => {
            return (
              <View style={styles.dropdownItemStyle}>
                <Text style={styles.dropdownButtonTxtStyle}>{item}</Text>
              </View>
            );
          }}
        />
      </View>
    );
  }
}

function CustomPropertyReview({ navigation, route }) {
  const { rating } = route.params;
  const [properties, setProperties] = React.useState([]);
  const [propertyData, setPropertyData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  function dismiss() {
    Alert.alert("Discard review?", "You have an unsaved review.", [
      { text: "Don't leave", style: "cancel", onPress: () => {} },
      {
        text: "Discard",
        style: "destructive",
        onPress: () => navigation.navigate("navbar"),
      },
    ]);
  }

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

        if (res.ok) {
          const res_json = await res.json();
          return res_json.results.documents.map((property) => {
            return {
              id: property.$id,
              name: property.name,
              type: property.type,
            };
          });
        } else {
          console.log("error fetching properties: " + res.status);
        }
      } catch (error) {
        console.error(error);
        // setErrorMessage("An error occurred fetching the books.");
        // setErrorModalVisible(true);
      }
    }

    getCustomProperty()
      .then((data) => {
        setLoading(false);
        setProperties(data);
      })
      .catch((error) => {
        console.error(error);
        // setErrorMessage("An error occurred fetching the recommended books.");
        // setErrorModalVisible(true);
      });
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
      <TouchableOpacity
        style={{ margin: 20, marginBottom: 10, alignSelf: "flex-end" }}
        onPress={dismiss}
      >
        <Icon name={"close"} color="black" size={25} />
      </TouchableOpacity>
      <Text style={styles.title}>Custom Properties</Text>
      {loading ? (
          <ActivityIndicator
            color={Colors.BUTTON_TEXT_GRAY}
            style={{ transform: [{ scaleX: 2 }, { scaleY: 2 }] }}
          />
        ) : (
          properties.length == 0 ? (
            <View>
              <Text style={styles.propertyInput}>
                You have no custom properties!
              </Text>
            </View>
          ) : (properties.map((item, index) => (
            <View key={index}>
              <PropertyInput
                property={item}
                propertyData={propertyData}
                setPropertyData={setPropertyData}
                index={index}
              />
            </View>
        ))))}
      <Pressable
        onPress={() =>
          navigation.navigate("textReviewModal", {
            rating: rating,
            propertyData: propertyData,
          })
        }
        style={styles.nextButton}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginHorizontal: 40,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  propertyInput: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 10,
    paddingHorizontal: 10,
    textAlign: "center",
  },
  nameInput: {
    margin: 12,
    marginTop: 40,
    borderWidth: 1,
    padding: 10,
    borderColor: Colors.BOOK_INFO_MODAL_GREY_LINE_COLOR,
    borderRadius: 15,
    width: "80%",
    height: 50,
  },
  categoryInput: {
    display: "flex",
    margin: 12,
    marginTop: 5,
    borderWidth: 1,
    padding: 10,
    borderColor: Colors.BOOK_INFO_MODAL_GREY_LINE_COLOR,
    borderRadius: 15,
    width: 310,
    height: 50,
    justifyContent: "center",
    alignSelf: "center",
  },
  saveButton: {
    backgroundColor: Colors.BUTTON_PURPLE,
    padding: 10,
    paddingHorizontal: 20,
    marginBottom: 100,
    borderRadius: 10,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  dropdown4BtnStyle: {
    width: "80%",
    height: 50,
    backgroundColor: "white",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.BOOK_INFO_MODAL_GREY_LINE_COLOR,
    marginBottom: 12,
    marginTop: 5,
    alignSelf: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    paddingLeft: 10,
  },
  nextButtonText: {
    color: "black",
    fontWeight: "600",
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: Colors.BUTTON_GRAY,
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: "center",
    marginTop: 10,
  },
  dropdownItemStyle: {
    backgroundColor: Colors.BUTTON_GRAY,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 0.2,
    borderBottomColor: Colors.BOOK_INFO_MODAL_GREY_LINE_COLOR,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "400",
    color: "black",
    textAlign: "center",
  },
});

export default CustomPropertyReview;
