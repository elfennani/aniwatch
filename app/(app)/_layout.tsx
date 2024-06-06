import { StyleSheet, useColorScheme } from "react-native";
import React, { useEffect } from "react";
import { Redirect, SplashScreen, Stack } from "expo-router";
import { useSession } from "@/ctx/session";
import { useTheme } from "@/ctx/theme-provider";
import chroma from "chroma-js";
import { NativeStack } from "@/components/native-stack";

SplashScreen.preventAutoHideAsync();

const AppLayout = () => {
  const { session } = useSession();
  const scheme = useColorScheme();
  const background = scheme == "dark" ? "black" : "white";

  if (!session) {
    return <Redirect href={"/signin" as any} />;
  }

  return (
    <NativeStack
      screenOptions={{
        orientation: "portrait",
        headerShown: false,
        navigationBarColor: chroma(background).alpha(0).css(),
        contentStyle: { backgroundColor: background },
      }}
    ></NativeStack>
  );
};

export default AppLayout;

const styles = StyleSheet.create({});
