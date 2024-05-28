import { View } from "react-native";
import React from "react";
import { ThemeProvider } from "../ctx/theme-provider";
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  useFonts,
} from "@expo-google-fonts/manrope";
import "../global.css";
import { useColorScheme } from "nativewind";

/** @type{import("@storybook/react").Preview} */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },

  decorators: [
    (Story, { parameters }) => {
      const [loaded, error] = useFonts({
        regular: Manrope_400Regular,
        medium: Manrope_500Medium,
        semibold: Manrope_600SemiBold,
      });
      const { colorScheme: scheme } = useColorScheme();

      if (!loaded) return null;

      return (
        <ThemeProvider>
          <View
            style={[
              {
                flex: 1,
                backgroundColor: scheme == "dark" ? "black" : "white",
              },
              parameters.padding !== "disabled" && { padding: 24 },
              parameters?.layout === "centered" && {
                alignItems: "center",
                justifyContent: "center",
              },
            ]}
          >
            <Story />
          </View>
        </ThemeProvider>
      );
    },
  ],
};

export default preview;
