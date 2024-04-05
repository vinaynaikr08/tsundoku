import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ViewCustomProperties from "../ViewCustomProperties/ViewCustomProperties";
import EditCustomProperty from "../EditCustomProperty/EditCustomProperty";

export interface ViewCustomPropertiesWrapperStackParamList {
  ViewCustomProperties: undefined;
  EditCustomProperty: { propertyInfo: any; setPropertiesChanged: any };
}

const Stack = createStackNavigator<ViewCustomPropertiesWrapperStackParamList>();

function ViewCustomPropertiesWrapper() {
  return (
    <Stack.Navigator>
      <Stack.Group
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="ViewCustomProperties"
          component={ViewCustomProperties}
        />
        <Stack.Screen
          name="EditCustomProperty"
          component={EditCustomProperty}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}

export default ViewCustomPropertiesWrapper;
