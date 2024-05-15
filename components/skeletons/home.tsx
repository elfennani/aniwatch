import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import Skeleton from "../skeleton";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeSkeleton() {
  const { top } = useSafeAreaInsets();

  return (
    <ScrollView
      contentContainerStyle={{
        paddingTop: top + 16,
        paddingHorizontal: 16,
        gap: 16,
      }}
    >
      <View style={{ flexDirection: "row", gap: 8 }}>
        <Skeleton height={40} style={{ flex: 1, borderRadius: 40 }} />
        <Skeleton width={40} height={40} style={{ borderRadius: 40 }} />
        <Skeleton width={40} height={40} style={{ borderRadius: 40 }} />
      </View>
      <Skeleton height={32} width="59%" />
      <Skeleton height={129} />
      <Skeleton height={32} width="66%" />
      <ScrollView horizontal contentContainerStyle={{ gap: 16 }}>
        <Skeleton width={129} style={{ aspectRatio: 0.69 }} />
        <Skeleton width={129} style={{ aspectRatio: 0.69 }} />
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
