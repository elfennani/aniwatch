import { StyleSheet, View, useColorScheme } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider as StackThemeProvider,
} from "@react-navigation/native";
import React, { useEffect } from "react";
import { QueryClient } from "@tanstack/react-query";
import { Slot, SplashScreen, usePathname } from "expo-router";
import { SessionProvider } from "@/ctx/session";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  useFonts,
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
} from "@expo-google-fonts/manrope";
import { StatusBar } from "expo-status-bar";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { storage } from "@/utils/mmkv";
import theme from "@/constants/theme";
import darkTheme from "@/constants/dark-theme";
import { ThemeProvider } from "@/ctx/theme-provider";
import * as Brightness from "expo-brightness";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { gcTime: Infinity, staleTime: 1000 * 60 },
  },
});

const clientStorage = {
  setItem: (key: string, value: string) => {
    storage.set(key, value);
  },
  getItem: (key: string) => {
    const value = storage.getString(key);
    return value === undefined ? null : value;
  },
  removeItem: (key: string) => {
    storage.delete(key);
  },
};

const asyncStoragePersister = createSyncStoragePersister({
  storage: clientStorage,
});

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const scheme = useColorScheme();
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

  const backgroundColor =
    scheme == "light" ? theme.colors.background : darkTheme.colors.background;

  if (!loaded) {
    return (
      <View style={[StyleSheet.absoluteFill, { backgroundColor }]}>
        <StatusBar hidden={false} style="light" />
      </View>
    );
  }

  return <RootLayoutNav />;
}

const RootLayoutNav = () => {
  const scheme = useColorScheme();
  const pathname = usePathname();
  const currentTheme = scheme == "light" ? theme : darkTheme;
  const stackTheme = scheme == "light" ? DefaultTheme : DarkTheme;
  const backgroundColor =
    scheme == "light" ? theme.colors.background : darkTheme.colors.background;

  const darkThemeOverrides: Theme = {
    ...stackTheme,
    colors: {
      ...stackTheme.colors,
      background: currentTheme.colors.background,
      card: currentTheme.colors.card,
    },
    dark: scheme == "dark",
  };

  useEffect(() => {
    if (!pathname.includes("/watch")) {
      Brightness.restoreSystemBrightnessAsync();
    }
  }, [pathname]);

  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor }]}>
      <StackThemeProvider value={darkThemeOverrides}>
        <ThemeProvider>
          <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{ persister: asyncStoragePersister }}
          >
            <SessionProvider>
              <StatusBar
                hidden={false}
                style={scheme == "light" ? "dark" : "light"}
              />
              <Slot />
            </SessionProvider>
          </PersistQueryClientProvider>
        </ThemeProvider>
      </StackThemeProvider>
    </View>
  );
};

const styles = StyleSheet.create({});
