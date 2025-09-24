// src/features/questionnaire/navigation/QuestionnaireNavigator.tsx
/**
 * @file src/features/questionnaire/navigation/QuestionnaireNavigator.tsx
 * @description Navigator for the questionnaire screens
 */

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { QuestionnaireScreen } from "../screens";
import type { QuestionnaireStackParamList } from "../types";

const Stack = createStackNavigator<QuestionnaireStackParamList>();

export const QuestionnaireNavigator: React.FC = React.memo(() => {
  return (
    <Stack.Navigator
      initialRouteName="QuestionnaireScreen"
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
        // אם תרצה: presentation: "card",
      }}
    >
      <Stack.Screen
        name="QuestionnaireScreen"
        component={QuestionnaireScreen}
      />
    </Stack.Navigator>
  );
});

export default QuestionnaireNavigator;
