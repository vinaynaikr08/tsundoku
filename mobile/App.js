import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import * as Constants from './constants';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>tsundoku</Text>
      <Text>1. The practice of buying books and not reading them, letting them pile up with other unread books</Text>

      <Pressable onPress={launchStart}>
        <Text>Replace me with right arrow</Text>
      </Pressable>
      <StatusBar style="auto" />
    </View>
  );
}

function launchStart() {
  // TODO: Implement
  console.log("Open setup");
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.ONBOARDING_BG_PINK,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
