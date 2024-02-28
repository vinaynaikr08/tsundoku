import { NavigationContainer } from "@react-navigation/native";
import NavBar from "./navigation/NavBar";
import AppNavigation from "./navigation/AppNavigation";
import Toast from "react-native-toast-message";

export default function App() {
  return (
    <>
      <NavigationContainer>
        <AppNavigation />
      </NavigationContainer>
      <Toast />
    </>
  );
}
