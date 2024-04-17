import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import React from "react";

type Props = {
  width: number;
  height: number;
  style?: StyleProp<ViewStyle>;
};

const Loader = ({ height, width, style }: Props) => {
  return <View style={[{ height, width }, styles.loader, style]} />;
};

export default Loader;

const styles = StyleSheet.create({
  loader: {
    backgroundColor: "#e2e8f0",
    borderRadius: 4,
  },
});
