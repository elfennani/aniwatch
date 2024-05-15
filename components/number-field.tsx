import { StyleSheet, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import Box from "./box";
import { Iconify } from "react-native-iconify";
import { useTheme } from "@/ctx/theme-provider";
import theme from "@/constants/theme";

export type NumberFieldProps = {
  max?: number;
  value: number;
  onChange: (value: number) => void;
};

const NumberField = ({ onChange, value, max }: NumberFieldProps) => {
  const { colors, textVariants } = useTheme();

  const minDisabled = value <= 0;
  const maxDisabled = max ? value >= max : false;

  const handleChange = (val: string) => {
    const number = Number(val);
    if (number < 0) {
      onChange(0);
      return;
    }
    if (max && number > max) {
      onChange(max);
      return;
    }

    onChange(Number(val));
  };

  return (
    <Box row gap="xs">
      <TouchableOpacity
        disabled={minDisabled}
        hitSlop={8}
        activeOpacity={0.8}
        onPress={() => onChange(value - 1)}
      >
        <Box
          height="3xl"
          width="3xl"
          background={"card"}
          style={[styles.button, { opacity: minDisabled ? 0.5 : 1 }]}
          rounding="xs"
        >
          <Iconify
            icon="material-symbols-light:remove-rounded"
            size={32}
            color={colors.secondary}
          />
        </Box>
      </TouchableOpacity>
      <TextInput
        style={[
          textVariants.body,
          styles.input,
          { backgroundColor: colors.card, color: colors.foreground },
        ]}
        keyboardType="numeric"
        value={value.toString()}
        onChangeText={handleChange}
      />
      <TouchableOpacity
        disabled={maxDisabled}
        hitSlop={17}
        onPress={() => onChange(value + 1)}
      >
        <Box
          height="3xl"
          width="3xl"
          background="card"
          style={[styles.button, { opacity: maxDisabled ? 0.5 : 1 }]}
          rounding="xs"
        >
          <Iconify
            icon="material-symbols-light:add"
            size={32}
            color={colors.secondary}
          />
        </Box>
      </TouchableOpacity>
    </Box>
  );
};

export default NumberField;

const styles = StyleSheet.create({
  button: { alignItems: "center", justifyContent: "center" },
  input: {
    flex: 1,
    height: theme.spacing["3xl"],
    borderRadius: theme.spacing.xs,
    paddingHorizontal: theme.spacing.lg,
    textAlign: "center",
  },
});
