import Colors from "@/Constants/Colors";
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

function CreateReadingChallenge() {
  function saveChallenge() {}
  const [name, setName] = React.useState("");
  const [bookNum, setBookNum] = React.useState("");
  const [startMonth, setStartMonth] = React.useState("");
  const [startDay, setStartDay] = React.useState("");
  const [startYear, setStartYear] = React.useState("");
  const [endMonth, setEndMonth] = React.useState("");
  const [endDay, setEndDay] = React.useState("");
  const [endYear, setEndYear] = React.useState("");
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
        <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
          <TextInput
            style={styles.dateInput}
            onChangeText={setStartMonth}
            value={startMonth}
            placeholder="Month"
            placeholderTextColor={Colors.BUTTON_TEXT_GRAY}
          />
          <TextInput
            style={styles.dateInput}
            onChangeText={setStartDay}
            value={startDay}
            placeholder="Day"
            placeholderTextColor={Colors.BUTTON_TEXT_GRAY}
          />
          <TextInput
            style={styles.dateInput}
            onChangeText={setStartYear}
            value={startYear}
            placeholder="Year"
            placeholderTextColor={Colors.BUTTON_TEXT_GRAY}
          />
        </View>
        <Text style={styles.dateTitle}>End Date</Text>
        <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
          <TextInput
            style={styles.dateInput}
            onChangeText={setEndMonth}
            value={endMonth}
            placeholder="Month"
            placeholderTextColor={Colors.BUTTON_TEXT_GRAY}
          />
          <TextInput
            style={styles.dateInput}
            onChangeText={setEndDay}
            value={endDay}
            placeholder="Day"
            placeholderTextColor={Colors.BUTTON_TEXT_GRAY}
          />
          <TextInput
            style={styles.dateInput}
            onChangeText={setEndYear}
            value={endYear}
            placeholder="Year"
            placeholderTextColor={Colors.BUTTON_TEXT_GRAY}
          />
        </View>

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
});
export default CreateReadingChallenge;
