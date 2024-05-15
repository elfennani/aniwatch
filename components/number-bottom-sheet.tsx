import { StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import BottomSheet, { BottomSheetProps } from "./bottom-sheet";
import Box from "./box";
import NumberField, { NumberFieldProps } from "./number-field";
import theme from "@/constants/theme";
import Text from "./text";

type Props = { name: string } & NumberFieldProps &
  Omit<BottomSheetProps, "label" | "children">;

const NumberBottomSheet = ({ value, onChange, name, max, ...props }: Props) => {
  const [val, setVal] = useState(value);

  useEffect(() => {
    if (props.visible) {
      setVal(value);
    }
  }, [props.visible]);

  function handlePress(): void {
    onChange(val);
    props.onClose();
  }

  return (
    <BottomSheet label={`Set ${name}`} {...props}>
      <Box gap="xl">
        <NumberField max={max} value={val} onChange={setVal} />
        <TouchableOpacity activeOpacity={0.8} onPress={handlePress}>
          <Box
            style={styles.button}
            row
            rounding="xs"
            height="3xl"
            gap="sm"
            background="primary"
          >
            <Text
              variant="label"
              color="white"
              style={{ textTransform: "capitalize" }}
            >
              Save
            </Text>
          </Box>
        </TouchableOpacity>
      </Box>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default NumberBottomSheet;
