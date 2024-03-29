import { NavigationContainer } from "@react-navigation/native";
import registerNNPushToken from "native-notify";
import Toast from "react-native-toast-message";
import LoginStateProvider from "./Providers/LoginStateProvider";
import AppNavigation from "./navigation/AppNavigation";

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
