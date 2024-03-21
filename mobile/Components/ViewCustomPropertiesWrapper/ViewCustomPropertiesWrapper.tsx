import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ViewCustomProperties from "../ViewCustomProperties/ViewCustomProperties";

const Stack = createStackNavigator();

function ViewCustomPropertiesWrapper() {
  return (
      <Stack.Navigator>
        <Stack.Group
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="customPropertyList" component={ViewCustomProperties} />
        </Stack.Group>
      </Stack.Navigator>
  );
}

export default ViewCustomPropertiesWrapper;
