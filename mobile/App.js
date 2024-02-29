import { NavigationContainer } from "@react-navigation/native";
import NavBar from "./navigation/NavBar";
import AppNavigation from "./navigation/AppNavigation";
import Toast from "react-native-toast-message";
import LoginStateProvider from "./Providers/LoginStateProvider";

export default function App() {
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
