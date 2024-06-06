import { ParamListBase, StackNavigationState } from "@react-navigation/native";
import {
  // createStackNavigator,
  // StackNavigationEventMap,
  // StackNavigationOptions,
  NativeStackNavigationEventMap,
  NativeStackNavigationOptions,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import { withLayoutContext } from "expo-router";

const { Navigator } = createNativeStackNavigator();

export const NativeStack = withLayoutContext<
  NativeStackNavigationOptions,
  typeof Navigator,
  StackNavigationState<ParamListBase>,
  NativeStackNavigationEventMap
>(Navigator);
