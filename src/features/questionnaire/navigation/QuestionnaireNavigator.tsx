/**
 * @file src/features/questionnaire/navigation/QuestionnaireNavigator.tsx
 * @description Navigator for the questionnaire screens
 */

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { QuestionnaireScreen } from "../screens";
import { QuestionnaireStackParamList } from "../types";

const Stack = createStackNavigator<QuestionnaireStackParamList>();

export const QuestionnaireNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="QuestionnaireScreen"
        component={QuestionnaireScreen}
      />
    </Stack.Navigator>
  );
};

export default QuestionnaireNavigator;
