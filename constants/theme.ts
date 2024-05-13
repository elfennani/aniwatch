import { TextStyle } from "react-native";
import palette from "./palette";

const theme = {
  colors: {
    background: palette.white,
    foreground: palette.zinc["900"],
    secondary: palette.zinc["600"],
    faded: palette.zinc["300"],
    card: palette.zinc["100"],
    loading: palette.zinc["200"],
    primary: palette.purple["500"],
    failure: palette.red["500"],
    white: palette.white,
    black: palette.black,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    "2xl": 32,
    "3xl": 40,
    "4xl": 48,
    "5xl": 56,
    "6xl": 64,
  },
  textVariants: {
    title: {
      fontSize: 18,
      fontFamily: "regular"
    },
    body: {
      fontSize: 14,
      fontFamily: "regular"
    },
    label: {
      fontSize: 12,
      fontFamily: "semibold"
    },
    small: {
      fontSize: 10
    }
  } satisfies Record<string, TextStyle>,
}

// regular
// medium
// semibold

export default theme;