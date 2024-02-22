import { NavigationContainer } from "@react-navigation/native";
import NavBar from "./navigation/NavBar";
import AppNavigation from "./navigation/AppNavigation";

export default function App() {
  return (
    <NavigationContainer>
      <AppNavigation />
    </NavigationContainer>
  );
}
