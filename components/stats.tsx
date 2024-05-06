import { StyleSheet, View } from "react-native";
import React from "react";
import Box from "./box";
import Text from "./text";

type Props = {
  children: React.ReactNode | React.ReactNode[];
};

const Stats = ({ children }: Props) => {
  return (
    <Box
      background="card"
      row
      paddingVertical="lg"
      paddingHorizontal="xl"
      rounding="sm"
      style={{ justifyContent: "space-between" }}
    >
      {children}
    </Box>
  );
};

interface StatProps {
  label: string;
  value: any;
}

Stats.Stat = ({ label, value }: StatProps) => (
  <Box gap="xs" style={{ alignItems: "center" }}>
    <Text color="primary">{typeof value == "undefined" ? "N/A" : value}</Text>
    <Text style={{ fontSize: 10 }} color="secondary">
      {label}
    </Text>
  </Box>
);

export default Stats;
