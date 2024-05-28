import palette from "./palette"
import theme from "./theme"

const darkTheme = {
  ...theme,
  dark: true,
  colors: {
    ...theme.colors,
    background: palette.zinc["900"],
    foreground: palette.zinc["50"],
    secondary: palette.zinc["300"],
    card: palette.zinc["800"],
    loading: palette.zinc["700"]
  }
}

export default darkTheme