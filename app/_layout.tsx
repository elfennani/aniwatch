import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot } from "expo-router";
import { SessionProvider } from "@/ctx/session";
type Props = {};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { gcTime: Infinity },
  },
});

const RootLayout = (props: Props) => {
  return (
    <QueryClientProvider
      client={queryClient}
      // persistOptions={{ persister: clientPersister }}
    >
      <SessionProvider>
        <Slot />
      </SessionProvider>
    </QueryClientProvider>
  );
};

export default RootLayout;

const styles = StyleSheet.create({});
