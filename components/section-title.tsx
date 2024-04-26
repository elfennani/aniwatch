import { StyleSheet, TextProps, View } from "react-native";
import React, { ReactNode } from "react";
import Text from "./text";

type Props = TextProps;

const SectionTitle = (props: Props) => {
  return <Text {...props} style={[styles.title, props.style]} />;
};

export default SectionTitle;

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: "500" },
});
