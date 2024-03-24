import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ViewCustomProperties from "../ViewCustomProperties/ViewCustomProperties";
import EditCustomProperty from "../EditCustomProperty/EditCustomProperty";

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
          <Stack.Screen name="editCustomProperty" component={EditCustomProperty} />
        </Stack.Group>
      </Stack.Navigator>
  );
}

export default ViewCustomPropertiesWrapper;
