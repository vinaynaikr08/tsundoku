import { NavigationContainer } from "@react-navigation/native";
import NavBar from "./navigation/NavBar";
import AppNavigation from "./navigation/AppNavigation";
import Toast from "react-native-toast-message";
import LoginStateProvider from "./Providers/LoginStateProvider";
import registerNNPushToken from "native-notify";

export default function App() {
  registerNNPushToken(20437, "yoXi9lQ377rDWZeu0R8IdW");

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
