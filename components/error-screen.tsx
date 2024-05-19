import { StyleSheet } from "react-native";
import React from "react";
import { Iconify } from "react-native-iconify";
import Box from "./box";
import Text from "./text";
import Button from "./button";

type Props = {
  error?: Error | null;
  onRetry: () => void;
  isRetrying: boolean;
};

const ErrorScreen = ({ isRetrying, onRetry, error }: Props) => {
  const icon = (
    <Iconify
      icon="material-symbols-light:refresh-rounded"
      color="white"
      size={24}
    />
  );

  return (
    <Box
      flex
      gap="3xl"
      style={{ alignItems: "stretch", justifyContent: "center" }}
    >
      <Box gap="sm">
        <Text variant="title" style={{ textAlign: "center" }}>
          Error!
        </Text>
        <Text color="secondary" variant="label" style={{ textAlign: "center" }}>
          {error?.message ?? "Something went wrong.\nPlease try again"}
        </Text>
      </Box>
      <Button
        onPress={() => onRetry()}
        leading={icon}
        color="failure"
        disabled={isRetrying}
        label="Try Again"
        style={{ alignSelf: "center" }}
      />
    </Box>
  );
};

export default ErrorScreen;

const styles = StyleSheet.create({});
