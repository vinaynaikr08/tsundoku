import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ViewCustomProperties from "../ViewCustomProperties/ViewCustomProperties";
import EditCustomProperty from "../EditCustomProperty/EditCustomProperty";

export interface ViewCustomPropertiesWrapperStackParamList {
  // Workaround for interfaces not being indexed by Typescript
  //  See https://www.reddit.com/r/typescript/comments/r9e75x/confusion_in_why_a_type_is_valid_but_not_an/
  //  for more information.
  [k: string]: object | undefined;
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
