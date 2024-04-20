import { NavigationContainer } from "@react-navigation/native";
import registerNNPushToken from "native-notify";
import Toast from "react-native-toast-message";
import LoginStateProvider from "./Providers/LoginStateProvider";
import AppNavigation from "./navigation/AppNavigation";
import axios from "axios";

// import { LogBox } from "react-native";
// LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
// LogBox.ignoreAllLogs();

export default function App() {
  registerNNPushToken(20878, "sMBFDEdTPOzXb6A2bqP169");

  const here = axios.get(
    `https://app.nativenotify.com/api/expo/indie/subs/20878/sMBFDEdTPOzXb6A2bqP169`,
  );
  here.then((response) => {
    //   for (const here in response.data) {
    //   }
    response.data.forEach((element) => {
      console.log(element.sub_id);
    });
  });

  return (
    <>
      <LoginStateProvider>
        <NavigationContainer>
          <AppNavigation />
        </NavigationContainer>
      </LoginStateProvider>
      <Toast />
    </>
  );
}
