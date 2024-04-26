import { StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { Redirect, SplashScreen, Stack } from "expo-router";
import { useSession } from "@/ctx/session";
import zinc from "@/utils/zinc";

SplashScreen.preventAutoHideAsync();

const AppLayout = () => {
  const { isLoading, session } = useSession();

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
        contentStyle: { backgroundColor: zinc[900] },
        orientation: "portrait",
        navigationBarColor: "transparent",
        statusBarTranslucent: true,
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "Home", headerShown: false }}
      />
    </Stack>
  );
};

export default AppLayout;

const styles = StyleSheet.create({});
