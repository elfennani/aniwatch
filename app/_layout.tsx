import { StyleSheet, View } from "react-native";
import { DarkTheme, Theme, ThemeProvider } from "@react-navigation/native";
import React, { useEffect } from "react";
import { QueryClient } from "@tanstack/react-query";
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
import { StatusBar } from "expo-status-bar";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { storage } from "@/utils/mmkv";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { gcTime: Infinity },
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

const RootLayoutNav = () => {
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
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{ persister: asyncStoragePersister }}
        >
          <SessionProvider>
            <StatusBar hidden={false} style="light" />
            <Slot />
          </SessionProvider>
        </PersistQueryClientProvider>
      </ThemeProvider>
    </View>
  );
};

const styles = StyleSheet.create({});
