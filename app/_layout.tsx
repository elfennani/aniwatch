import { StyleSheet, Text, View } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot, SplashScreen } from "expo-router";
import { SessionProvider } from "@/ctx/session";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  useFonts,
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
} from "@expo-google-fonts/manrope";
import zinc from "@/utils/zinc";
type Props = {};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { gcTime: Infinity },
  },
});

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...AntDesign.font,
    regular: Manrope_400Regular,
    medium: Manrope_500Medium,
    semibold: Manrope_600SemiBold,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

const RootLayoutNav = (props: Props) => {
  const darkThemeOverrides: Theme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: "#000000",
      card: "#000000",
    },
  };

  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: zinc[900] }]}>
      <ThemeProvider value={darkThemeOverrides}>
        <QueryClientProvider client={queryClient}>
          <SessionProvider>
            <Slot />
          </SessionProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </View>
  );
};

const styles = StyleSheet.create({});
