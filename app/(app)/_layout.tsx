import { StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { Redirect, SplashScreen, Stack } from "expo-router";
import { useSession } from "@/ctx/session";
import { useTheme } from "@/ctx/theme-provider";

SplashScreen.preventAutoHideAsync();

const AppLayout = () => {
  const { isLoading, session } = useSession();
  const {
    colors: { background },
  } = useTheme();

  useEffect(() => {
    if (!isLoading) SplashScreen.hideAsync();
  }, [isLoading]);

  if (isLoading) return null;

  if (!session) {
    return <Redirect href={"/signin" as any} />;
  }

  return (
    <Stack
      screenOptions={{
        orientation: "portrait",
        headerShown: false,
        navigationBarColor: background,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default AppLayout;

const styles = StyleSheet.create({});
