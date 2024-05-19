import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import React, { ReactNode } from "react";
import Box from "./box";
import Text from "./text";
import theme from "@/constants/theme";

export type ButtonProps = {
  label: string;
  leading?: ReactNode;
  color?: keyof (typeof theme)["colors"];
} & TouchableOpacityProps;

const Button = ({
  label,
  leading,
  color = "primary",
  ...props
}: ButtonProps) => {
  return (
    <TouchableOpacity activeOpacity={0.8} {...props}>
      <Box
        style={styles.button}
        row
        rounding="xs"
        height="3xl"
        paddingHorizontal="lg"
        gap="sm"
        background={props.disabled ? "secondary" : color}
      >
        {leading}
        <Text
          variant="bold"
          color="white"
          style={{ textTransform: "capitalize" }}
        >
          {label}
        </Text>
      </Box>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
  },
});
