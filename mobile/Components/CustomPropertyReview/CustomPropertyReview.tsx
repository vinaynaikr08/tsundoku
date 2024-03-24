import {
  BACKEND_API_CUSTOM_PROPERTY_TEMPLATE_URL,
  BACKEND_API_CUSTOM_PROPERTY_CATEGORIES_URL,
} from "@/Constants/URLs";
import * as React from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Pressable } from "react-native";
import { Account } from "appwrite";
import { client } from "@/appwrite";
import Colors from "@/Constants/Colors";
import { ScrollView } from "react-native-gesture-handler";
import { useContext } from "react";
import { BookInfoContext } from "@/Contexts";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const account = new Account(client);

function PropertyInput({ property, propertyData, setPropertyData }) {
  let newProperty;
  const [categories, setCategories] = React.useState(null);
  const booleanCategories = [ "true", "false"];
  const handleInputChange = (value: string) => {
    const newPropertyData = [
      ...propertyData,
      { template_id: property.id, value: value },
    ];
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
          defaultButtonText={"Select true or false"}
          buttonTextAfterSelection={(selectedItem, index) => {
            return selectedItem;
          }}
          rowTextForSelection={(item, index) => {
            return item;
          }}
          buttonStyle={styles.dropdown4BtnStyle}
          buttonTextStyle={{ color: Colors.BUTTON_TEXT_GRAY }}
          dropdownOverlayColor={"transparent"}
          renderDropdownIcon={(isOpened) => {
            return (
              <Icon
                name={
                  isOpened
                    ? "chevron-up-circle-outline"
                    : "chevron-down-circle-outline"
                }
                color={Colors.BUTTON_PURPLE}
                size={25}
              />
            );
          }}
          dropdownIconPosition={"left"}
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
          defaultButtonText={"Select category"}
          buttonTextAfterSelection={(selectedItem, index) => {
            return selectedItem;
          }}
          rowTextForSelection={(item, index) => {
            return item;
          }}
          buttonStyle={styles.dropdown4BtnStyle}
          buttonTextStyle={{ color: Colors.BUTTON_TEXT_GRAY }}
          dropdownOverlayColor={"transparent"}
          renderDropdownIcon={(isOpened) => {
            return (
              <Icon
                name={
                  isOpened
                    ? "chevron-up-circle-outline"
                    : "chevron-down-circle-outline"
                }
                color={Colors.BUTTON_PURPLE}
                size={25}
              />
            );
          }}
          dropdownIconPosition={"left"}
        />
      </View>
    );
  }
}

function CustomPropertyReview({ navigation, route }) {
  const { rating } = route.params;
  const [properties, setProperties] = React.useState([]);
  const [propertyData, setPropertyData] = React.useState([]);

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
      {properties &&
        properties.map((item, index) => (
          <View key={index}>
            <PropertyInput
              property={item}
              propertyData={propertyData}
              setPropertyData={setPropertyData}
            />
          </View>
        ))}
        <Pressable
          onPress={() =>
            navigation.navigate("textReviewModal", { rating: rating, propertyData: propertyData })
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
    backgroundColor: "#FFF",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.BOOK_INFO_MODAL_GREY_LINE_COLOR,
    marginBottom: 12,
    marginTop: 5,
    alignSelf: "center"
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
    alignSelf: "center"
  },
});

export default CustomPropertyReview;
