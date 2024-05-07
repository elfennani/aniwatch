import {
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import Box from "./box";
import AntDesign from "@expo/vector-icons/AntDesign";
import SectionTitle from "./section-title";
import { useTheme } from "@/ctx/theme-provider";
import { router } from "expo-router";
import Text from "./text";

type Props = {
  name: string;
  back?: boolean;
} & ({ button: true; label: string; onPress: () => void } | { button?: false });

const Heading = (props: Props) => {
  const {
    colors: { card, secondary },
    spacing,
  } = useTheme();
  return (
    <Box
      row
      style={{ alignItems: "center", marginBottom: spacing["lg"] }}
      gap="lg"
    >
      {props.back && (
        <TouchableHighlight
          underlayColor={card}
          onPress={() => router.canGoBack() && router.back()}
          style={{ borderRadius: 1000 }}
        >
          <Box padding="md">
            <AntDesign name="back" size={24} color={secondary} />
          </Box>
        </TouchableHighlight>
      )}
      <SectionTitle style={{ flex: 1 }}>{props.name}</SectionTitle>
      {props.button && (
        <TouchableOpacity
          onPress={props.onPress}
          activeOpacity={0.75}
          hitSlop={16}
        >
          <Text
            color="primary"
            variant="label"
            style={{ textTransform: "capitalize" }}
          >
            {props.label}
          </Text>
        </TouchableOpacity>
      )}
    </Box>
  );
};

export default Heading;

const styles = StyleSheet.create({});
