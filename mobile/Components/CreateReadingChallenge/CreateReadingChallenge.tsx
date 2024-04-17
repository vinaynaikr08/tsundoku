import Colors from "@/Constants/Colors";
import { BACKEND_API_READING_CHALLENGES } from "@/Constants/URLs";
import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Pressable,
  TouchableWithoutFeedback,
  StyleSheet,
  Keyboard,
} from "react-native";
import { client } from "@/appwrite";
import { Account } from "appwrite";
import Toast from "react-native-toast-message";
import DateTimePicker from '@react-native-community/datetimepicker';

const account = new Account(client);

function CreateReadingChallenge({navigation}) {
  const [name, setName] = React.useState("");
  const [bookNum, setBookNum] = React.useState("");
  const [startMonth, setStartMonth] = React.useState("");
  const [startDay, setStartDay] = React.useState("");
  const [startYear, setStartYear] = React.useState("");
  const [endMonth, setEndMonth] = React.useState("");
  const [endDay, setEndDay] = React.useState("");
  const [endYear, setEndYear] = React.useState("");
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());

  const onStartChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setStartDate(currentDate);
  };

  const onEndChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setEndDate(currentDate);
  };

  async function saveChallenge() {

    try {
      const res = await fetch(`${BACKEND_API_READING_CHALLENGES}`, {
        method: "post",
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: "Bearer " + (await account.createJWT()).jwt,
        }),
        body: JSON.stringify({
          name: name,
          book_count: bookNum,
          start: startDate.toISOString(),
          end: endDate.toISOString()
        }),
      });

      const res_json = await res.json();
      if (res.ok) {
        console.log("reading challenge created: " + JSON.stringify(res_json));
      } else {
        console.log(
          "error creating reading challenge: " + JSON.stringify(res_json),
        );
      }
    } catch (error) {
      console.error(error);
      // setErrorMessage("An error occurred fetching the books.");
      // setErrorModalVisible(true);
    }
    Toast.show({
      type: "success",
      text1: "Reading challenge successfully created!",
      position: "bottom",
      visibilityTime: 2000,
    });
    navigation.pop();
  }

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
        <Text style={styles.title}>Create New Reading Challenge</Text>
        <TextInput
          style={styles.nameInput}
          onChangeText={setName}
          value={name}
          placeholder="Reading Challenge Name"
          placeholderTextColor={Colors.BUTTON_TEXT_GRAY}
        />
        <TextInput
          style={styles.nameInput}
          onChangeText={setBookNum}
          value={bookNum}
          placeholder="Target Book Count"
          placeholderTextColor={Colors.BUTTON_TEXT_GRAY}
        />

        <Text style={styles.dateTitle}>Start Date</Text>
        <DateTimePicker
          testID="dateTimePicker"
          value={startDate}
          is24Hour={true}
          onChange={onStartChange}
          style={styles.datePicker}
        />
        <Text style={styles.dateTitle}>End Date</Text>
        <DateTimePicker
          testID="dateTimePicker"
          value={endDate}
          is24Hour={true}
          onChange={onEndChange}
          style={styles.datePicker}
        />
        <Pressable onPress={saveChallenge} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Create</Text>
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
    marginTop: 40,
    marginBottom: 30,
  },
  dateInput: {
    marginBottom: 20,
    marginTop: 0,
    borderWidth: 1,
    padding: 10,
    borderColor: Colors.BOOK_INFO_MODAL_GREY_LINE_COLOR,
    borderRadius: 15,
    width: "20%",
    height: 50,
  },
  dateTitle: {
    fontSize: 16,
    fontWeight: "600",
    paddingHorizontal: 10,
  },
  nameInput: {
    margin: 12,
    marginBottom: 20,
    marginTop: 0,
    borderWidth: 1,
    padding: 10,
    borderColor: Colors.BOOK_INFO_MODAL_GREY_LINE_COLOR,
    borderRadius: 15,
    width: "80%",
    height: 50,
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
  datePicker: {
    marginVertical: 10
  }
});
export default CreateReadingChallenge;
