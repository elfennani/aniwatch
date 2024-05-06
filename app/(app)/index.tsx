import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useViewerQuery from "@/api/use-viewer-query";
import MediaListingGrid from "@/components/media-listing-grid";
import SectionTitle from "@/components/section-title";
import AntDesign from "@expo/vector-icons/AntDesign";
import Text from "@/components/text";
import { Link } from "expo-router";
import MediaListingList from "@/components/media-listing-list";
import { Image } from "expo-image";
import Skeleton from "@/components/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { useTheme } from "@/ctx/theme-provider";
import Box from "@/components/box";
import useNotificationsQuery from "@/api/use-notifications-query";

const HomePage = () => {
  const { top } = useSafeAreaInsets();
  const { data: viewer, isError, isPending } = useViewerQuery();
  const { colors } = useTheme();
  const client = useQueryClient();

  if (isPending) {
    return (
      <ScrollView
        contentContainerStyle={{
          paddingTop: top + 16,
          paddingHorizontal: 16,
          gap: 16,
        }}
      >
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Skeleton height={48} style={{ flex: 1 }} />
          <Skeleton width={48} height={48} />
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

  if (isError) {
    return <View></View>;
  }

  const refreshControl = (
    <RefreshControl
      refreshing={false}
      onRefresh={() =>
        client.invalidateQueries({
          predicate: ({ queryKey }) =>
            queryKey.includes("show") || queryKey.includes("media"),
        })
      }
    />
  );

  return (
    <ScrollView
      contentContainerStyle={{ paddingTop: top + 16 }}
      refreshControl={refreshControl}
    >
      <View style={styles.header}>
        <Link href={`/search`} asChild style={{ flex: 1 }}>
          <TouchableOpacity activeOpacity={0.8}>
            <Box
              row
              padding="md"
              paddingHorizontal="lg"
              gap="md"
              rounding="sm"
              background="card"
              style={{ alignItems: "center" }}
            >
              <AntDesign name="search1" size={24} color={colors.secondary} />
              <Text color="secondary">Attack on Titan Season 2...</Text>
            </Box>
          </TouchableOpacity>
        </Link>
        <Link href={`/notifications`} asChild>
          <TouchableOpacity>
            <Box style={styles.notificationContainer} background="card">
              <AntDesign
                name="notification"
                size={18}
                color={colors.secondary}
              />
              {!!viewer.notifications && (
                <Box background="failure" style={styles.notifications}>
                  <Text
                    variant="small"
                    color="white"
                    style={{ lineHeight: 12 }}
                  >
                    {viewer.notifications}
                  </Text>
                </Box>
              )}
            </Box>
          </TouchableOpacity>
        </Link>
        <Link href={`/user/${viewer.id}`} asChild>
          <TouchableOpacity>
            <Image
              source={{ uri: viewer.avatar }}
              style={[styles.avatar, { backgroundColor: colors.card }]}
            />
          </TouchableOpacity>
        </Link>
      </View>
      <SectionTitle style={{ paddingHorizontal: 16 }}>
        Currently Watching
      </SectionTitle>
      <MediaListingList
        listing="watching"
        viewerId={viewer.id}
        contentContainerStyle={{
          padding: 16,
        }}
      />
      <SectionTitle style={{ paddingHorizontal: 16 }}>
        Recently Completed
      </SectionTitle>
      <MediaListingGrid
        listing="completed"
        viewerId={viewer.id}
        contentContainerStyle={{ padding: 16 }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  notifications: {
    padding: 2,
    position: "absolute",
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationContainer: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 40,
    position: "relative",
  },
  header: {
    padding: 16,
    paddingTop: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  page: {
    padding: 32,
    gap: 16,
  },
});

export default HomePage;
