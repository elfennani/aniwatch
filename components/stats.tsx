import { StyleSheet, View } from "react-native";
import React from "react";
import Box from "./box";
import Text from "./text";
import { cssInterop, verifyInstallation } from "nativewind";

type Props = {
  children: React.ReactNode | React.ReactNode[];
};

const Stats = ({ children }: Props) => {
  return <View className="px-6 gap-6 flex-row w-full">{children}</View>;
};

interface StatProps {
  label: string;
  value: any;
}

const Stat = ({ label, value }: StatProps) => {
  return (
    <View className="items-center justify-center flex-1 gap-1">
      <Text className="font-medium text-lg">
        {typeof value == "undefined" ? "N/A" : value}
      </Text>
      <Text className="text-xs !text-zinc-500">{label}</Text>
    </View>
  );
};

Stats.Stat = Stat;

export default Stats;
