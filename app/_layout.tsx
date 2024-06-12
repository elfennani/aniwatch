import { Platform, StyleSheet, View, useColorScheme } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider as StackThemeProvider,
} from "@react-navigation/native";
import React, { useEffect } from "react";
import { QueryClient, useIsRestoring } from "@tanstack/react-query";
import { Slot, SplashScreen, usePathname } from "expo-router";
import { SessionProvider } from "@/ctx/session";
import {
  useFonts,
  Manrope_400Regular as Regular,
  Manrope_500Medium as Medium,
  Manrope_600SemiBold as SemiBold,
} from "@expo-google-fonts/manrope";
import { StatusBar } from "expo-status-bar";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { storage } from "@/utils/mmkv";
import theme from "@/constants/theme";
import darkTheme from "@/constants/dark-theme";
import { ThemeProvider } from "@/ctx/theme-provider";
import * as Brightness from "expo-brightness";
import * as NavigationBar from "expo-navigation-bar";
import "./global.css";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PortalProvider } from "@gorhom/portal";
import { DownloadManagerProvider } from "@/ctx/download-manager";

if (Platform.OS == "android") {
  NavigationBar.setPositionAsync("absolute");
  NavigationBar.setBackgroundColorAsync("#ffffff01");
}

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
    regular: Regular,
    medium: Medium,
    semibold: SemiBold,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  const backgroundColor = scheme == "light" ? "white" : "black";

  if (!loaded) {
    return (
      <View style={[StyleSheet.absoluteFill, { backgroundColor }]}>
        <StatusBar hidden={false} style="light" />
      </View>
    );
  }

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: asyncStoragePersister }}
    >
      <RootLayoutNav />
    </PersistQueryClientProvider>
  );
}

const RootLayoutNav = () => {
  const scheme = useColorScheme();
  const pathname = usePathname();
  const isRestoring = useIsRestoring();
  const currentTheme = scheme == "light" ? theme : darkTheme;
  const backgroundColor = scheme == "light" ? "white" : "black";

  const darkThemeOverrides: Theme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: "black",
      card: currentTheme.colors.card,
    },
    dark: scheme == "dark",
  };
  const stackTheme = scheme == "light" ? DefaultTheme : darkThemeOverrides;

  useEffect(() => {
    if (!pathname.includes("/watch")) {
      Brightness.restoreSystemBrightnessAsync();
    }
  }, [pathname]);

  useEffect(() => {
    if (!isRestoring) {
      SplashScreen.hideAsync();
    }
  }, [isRestoring]);

  if (isRestoring) {
    return (
      <View style={[StyleSheet.absoluteFill, { backgroundColor }]}>
        <StatusBar hidden={false} style="light" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView
      style={[StyleSheet.absoluteFill, { backgroundColor }]}
    >
      <StackThemeProvider value={stackTheme}>
        <ThemeProvider>
          <SessionProvider>
            <DownloadManagerProvider>
              <PortalProvider>
                <StatusBar
                  hidden={false}
                  style={scheme == "light" ? "dark" : "light"}
                />
                <Slot />
              </PortalProvider>
            </DownloadManagerProvider>
          </SessionProvider>
        </ThemeProvider>
      </StackThemeProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({});
