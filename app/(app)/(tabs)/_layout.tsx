import { View, Text, useColorScheme } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { Iconify } from "react-native-iconify";

type Props = {};

const TabsLayout = (props: Props) => {
  const scheme = useColorScheme();
  const backgroundColor = scheme == "dark" ? "black" : "white";

  return (
    <Tabs
      screenOptions={{ headerShown: false, tabBarLabel: () => null }}
      sceneContainerStyle={{ backgroundColor }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused, size }) => (
            <Iconify
              icon="material-symbols-light:home"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="downloads"
        options={{
          title: "Downloads",
          tabBarIcon: ({ color, focused, size }) => (
            <Iconify
              icon="material-symbols-light:download-for-offline"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          tabBarIcon: ({ color, focused, size }) => (
            <Iconify
              icon="material-symbols-light:circle-notifications"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused, size }) => (
            <Iconify
              icon="material-symbols-light:person"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
