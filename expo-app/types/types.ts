// types.ts
import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  index: undefined;
  SearchPage: undefined;  // Update to match the name used in Stack.Screen
NotFoundScreen: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
