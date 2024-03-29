import Colors from "@/Constants/Colors";
import {
  BACKEND_API_CUSTOM_PROPERTY_CATEGORIES_URL,
  BACKEND_API_CUSTOM_PROPERTY_TEMPLATE_URL,
} from "@/Constants/URLs";
import Slider from "@react-native-community/slider";
import { Account } from "appwrite";
import React from "react";
import { useState } from "react";
import {
  Alert,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { client } from "../../appwrite";

function CategoryInputs({ numCategories, categories, setCategories }) {
  let category;
  const handleCategoryChange = (index: number, value: string) => {
    const newCategories = [...categories];
    newCategories[index] = value;
    setCategories(newCategories);
  };

  const inputs = [];
  for (let i = 0; i < numCategories; i++) {
    inputs.push(
      <TextInput
        key={i}
        style={styles.categoryInput}
        onChangeText={(value) => handleCategoryChange(i, value)}
        value={category}
        placeholder="Category Name"
        placeholderTextColor={Colors.BUTTON_TEXT_GRAY}
      />,
    );
  }

  return <>{inputs}</>;
}

function CreateCustomProperty({ navigation }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [numCategories, setNumCategories] = useState(1);
  const [categories, setCategories] = useState(Array(numCategories).fill(""));
  const propertyTypes = ["NUMERICAL", "CATEGORICAL", "BOOLEAN"];

  function dismiss() {
    Alert.alert("Discard property?", "You have an unsaved custom property.", [
      { text: "Don't leave", style: "cancel", onPress: () => {} },
      {
        text: "Discard",
        style: "destructive",
        onPress: () => navigation.navigate("navbar"),
      },
    ]);
  }

  const saveCustomProperty = async () => {
    if (name.length == 0 || type.length == 0) {
      return;
    }
    const account = new Account(client);

    const res = await fetch(`${BACKEND_API_CUSTOM_PROPERTY_TEMPLATE_URL}`, {
      method: "post",
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: "Bearer " + (await account.createJWT()).jwt,
      }),
      body: JSON.stringify({
        name: name,
        type: type,
      }),
    });

    if (res.ok) {
      const res_json = await res.json();
      console.log(
        "custom property saved to database: " + JSON.stringify(res_json),
      );

      if (type == "CATEGORICAL") {
        console.log("template id: " + JSON.stringify(res_json.template_id));
        const categories_res = await fetch(
          `${BACKEND_API_CUSTOM_PROPERTY_CATEGORIES_URL}`,
          {
            method: "post",
            headers: new Headers({
              "Content-Type": "application/json",
              Authorization: "Bearer " + (await account.createJWT()).jwt,
            }),
            body: JSON.stringify({
              template_id: res_json.template_id,
              values: categories,
            }),
          },
        );

        if (categories_res.ok) {
          console.log("categories saved to database");
        } else {
          console.log("error saving categories: " + categories_res.status);
        }
      }
    } else {
      console.log("error number: " + res.status);
    }

    Toast.show({
      type: "success",
      text1: "New custom property successfully saved!",
      position: "bottom",
      visibilityTime: 2000,
    });
    navigation.navigate("navbar");
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "white",
          width: "100%",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
      >
        <TouchableOpacity
          style={{ margin: 20, marginBottom: 10, alignSelf: "flex-end" }}
          onPress={dismiss}
        >
          <Icon name={"close"} color="black" size={25} />
        </TouchableOpacity>
        <Text style={styles.title}>Create Custom Property</Text>
        <TextInput
          style={styles.nameInput}
          onChangeText={setName}
          value={name}
          placeholder="Custom Property Name"
          placeholderTextColor={Colors.BUTTON_TEXT_GRAY}
        />
        <SelectDropdown
          data={propertyTypes}
          onSelect={(selectedItem) => {
            setType(selectedItem);
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
                  {selectedItem || "Select property type"}
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

        <View>
          {type == "CATEGORICAL" && (
            <View>
              <Text style={styles.title}>
                Number of Categories: {numCategories}{" "}
              </Text>
              <Slider
                style={{
                  display: "flex",
                  width: 315,
                  height: 40,
                  alignSelf: "center",
                }}
                onValueChange={setNumCategories}
                minimumValue={1}
                maximumValue={5}
                step={1}
                thumbTintColor={Colors.BUTTON_PURPLE}
                minimumTrackTintColor="black"
                maximumTrackTintColor={Colors.BOOK_INFO_MODAL_GREY_LINE_COLOR}
              />
              <CategoryInputs
                numCategories={numCategories}
                categories={categories}
                setCategories={setCategories}
              />
            </View>
          )}
        </View>

        <Pressable onPress={saveCustomProperty} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
      </View>
    </TouchableWithoutFeedback>
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
    marginBottom: 20,
    alignSelf: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    paddingLeft: 10,
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

export default CreateCustomProperty;
