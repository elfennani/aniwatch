import darkTheme from "@/constants/dark-theme";
import theme from "@/constants/theme";
import { createContext, useContext } from "react";
import { useColorScheme } from "react-native";

const ThemeContext = createContext<typeof theme | typeof darkTheme>({} as any);

export const ThemeProvider = ({ children }: any) => {
  const scheme = useColorScheme();

  return (
    <ThemeContext.Provider value={scheme == "light" ? theme : darkTheme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
