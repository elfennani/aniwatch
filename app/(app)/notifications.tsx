import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Box from "@/components/box";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import useNotificationsQuery from "@/api/use-notifications-query";
import { Image } from "expo-image";
import Text from "@/components/text";
import Notification from "@/interfaces/Notification";
import { useTheme } from "@/ctx/theme-provider";
import SectionTitle from "@/components/section-title";
import moment from "moment";
import { router } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";

export default function NotificationsScreen() {
  const { data, fetchNextPage, isFetchingNextPage } = useNotificationsQuery();
  const { spacing } = useTheme();
  const client = useQueryClient();

  useEffect(() => {
    client.invalidateQueries({
      queryKey: ["anilist", "viewer"],
    });
  }, [data]);

  const renderItem: ListRenderItem<Notification> = ({ item }) => (
    <TouchableOpacity
      disabled={!item.path}
      onPress={() => router.push(item.path)}
      activeOpacity={0.8}
    >
      <Box
        row
        style={{ width: "100%" }}
        gap="sm"
        rounding="sm"
        background="card"
      >
        <Image
          recyclingKey={item.id.toString()}
          cachePolicy="memory-disk"
          source={{ uri: item.thumbnail }}
          style={{ height: 128, aspectRatio: 0.69, borderRadius: spacing.xs }}
        />
        <Box flex padding="sm" gap="xs">
          <Text color="secondary" variant="label">
            {moment(item.createdAt * 1000).fromNow()}
          </Text>
          <Text flex>{item.content}</Text>
        </Box>
      </Box>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlashList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <SectionTitle style={{ marginBottom: 16 }}>
            Notifications
          </SectionTitle>
        }
        ItemSeparatorComponent={() => (
          <View style={{ height: spacing["md"] }} />
        )}
        contentContainerStyle={{ padding: spacing["xl"] }}
        estimatedItemSize={128}
        renderItem={renderItem}
        onEndReached={() => {
          if (!isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={1.8}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
