import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Skeleton from "../skeleton";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {};

const MediaDetailsSkeleton = (props: Props) => {
  const { top } = useSafeAreaInsets();

  return (
    <View>
      <View style={{ padding: 32, paddingTop: 32 + top, gap: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 16 }}>
          <Skeleton style={styles.cover} />
          <View style={{ flex: 1, gap: 8 }}>
            <Skeleton height={32} style={{ maxWidth: 175 }} />
            <Skeleton height={16} width={60} />
            <Skeleton height={16} width={120} />
          </View>
        </View>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Skeleton height={24} width={70} />
          <Skeleton height={24} width={65} />
          <Skeleton height={24} width={80} />
        </View>
      </View>
      <Skeleton height={1} radius={0} />
      <View style={{ padding: 32, gap: 16 }}>
        <Skeleton height={24} width={60} />
        <View style={{ gap: 8 }}>
          <Skeleton height={18} />
          <Skeleton height={18} />
          <Skeleton height={18} width="70%" />
        </View>
      </View>
    </View>
  );
};

export default MediaDetailsSkeleton;

const styles = StyleSheet.create({
  cover: {
    aspectRatio: 0.69,
    width: 128,
    borderRadius: 4,
  },
});
