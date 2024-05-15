import { StyleSheet, TouchableHighlight, View } from "react-native";
import React from "react";
import BottomSheet, { BottomSheetProps } from "./bottom-sheet";
import { POSSIBLE_STATUS } from "@/constants/values";
import MediaStatus from "@/interfaces/MediaStatus";
import { useTheme } from "@/ctx/theme-provider";
import Text from "./text";

type Props = {
  status?: MediaStatus;
  onChange: (status: MediaStatus) => void;
} & Omit<BottomSheetProps, "label" | "children">;

const StatusSelectBottomSheet = ({
  status: currentStatus,
  onChange,
  ...props
}: Props) => {
  const { colors, spacing } = useTheme();

  const handlePress = (status: MediaStatus) => () => {
    onChange(status);
    props.onClose();
  };

  return (
    <BottomSheet label="Select Status" {...props}>
      {Object.keys(POSSIBLE_STATUS).map((s) => {
        const status: MediaStatus = s as any;
        const text = POSSIBLE_STATUS[status];
        return (
          <TouchableHighlight
            key={status}
            onPress={handlePress(status)}
            style={{
              padding: spacing["md"],
              borderRadius: spacing["xs"],
              marginHorizontal: -spacing.md,
            }}
            underlayColor={colors.card}
            disabled={status == currentStatus}
          >
            <Text color={status == currentStatus ? "primary" : undefined}>
              {text}
            </Text>
          </TouchableHighlight>
        );
      })}
    </BottomSheet>
  );
};

export default StatusSelectBottomSheet;

const styles = StyleSheet.create({});
