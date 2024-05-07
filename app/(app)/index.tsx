import {
  Alert,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useViewerQuery, { fetchViewer } from "@/api/use-viewer-query";
import MediaListingGrid from "@/components/media-listing-grid";
import SectionTitle from "@/components/section-title";
import AntDesign from "@expo/vector-icons/AntDesign";
import Text from "@/components/text";
import { Link, router } from "expo-router";
import MediaListingList from "@/components/media-listing-list";
import { Image } from "expo-image";
import Skeleton from "@/components/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { useTheme } from "@/ctx/theme-provider";
import Box from "@/components/box";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import { GraphQLClient } from "graphql-request";
import { Session } from "@/ctx/session";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchNotifications } from "@/api/use-notifications-query";
import { storage } from "@/utils/mmkv";
import * as Notifications from "expo-notifications";
import moment from "moment";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function registerForNotificationsAsync() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    alert("Failed to get push token for push notification!");
    return false;
  }

  return true;
}

const BACKGROUND_FETCH_TASK = "background-fetch-notifications";

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  const sessionData = await AsyncStorage.getItem("session");
  if (!sessionData) return BackgroundFetch.BackgroundFetchResult.Failed;
  const session: Session = JSON.parse(sessionData);

  const notifsKey = "read-notifications";
  let readNotifications = JSON.parse(
    storage.getString(notifsKey) ?? "[]"
  ) as number[];

  const headers = new Headers();
  headers.append("Authorization", `Bearer ${session.access_token}`);

  const client = new GraphQLClient("https://graphql.anilist.co", { headers });
  const viewer = await fetchViewer(client);
  if (!viewer.notifications)
    return BackgroundFetch.BackgroundFetchResult.NoData;
  const notifs = await fetchNotifications(
    1,
    client,
    false,
    viewer.notifications
  );

  if (!notifs.length) return BackgroundFetch.BackgroundFetchResult.NoData;

  notifs.forEach((notif) => {
    if (readNotifications.includes(notif.id)) {
      return;
    }
    readNotifications = [...readNotifications, notif.id];
    storage.set(notifsKey, JSON.stringify(readNotifications));

    Notifications.scheduleNotificationAsync({
      identifier: `notification-${notif.id}`,
      content: {
        title: notif.content,
        data: {
          url: notif.path,
        },
      },
      trigger: null,
    });
  });

  return BackgroundFetch.BackgroundFetchResult.NewData;
});

async function registerBackgroundFetchAsync() {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 10 * 60,
    stopOnTerminate: false,
    startOnBoot: true,
  });
}

const HomePage = () => {
  const { top } = useSafeAreaInsets();
  const { data: viewer, isError, isPending } = useViewerQuery();
  const { colors } = useTheme();
  const client = useQueryClient();

  useEffect(() => {
    register();
  }, []);

  async function register() {
    if (await registerForNotificationsAsync()) {
      registerBackgroundFetchAsync();
    }
  }

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
              paddingHorizontal="md"
              gap="md"
              rounding="3xl"
              background="card"
              style={{ alignItems: "center", height: 40 }}
            >
              <AntDesign name="search1" size={18} color={colors.secondary} />
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
        <TouchableOpacity onPress={() => router.push(`/user/${viewer.id}`)}>
          <Image
            source={{ uri: viewer.avatar }}
            style={[styles.avatar, { backgroundColor: colors.card }]}
          />
        </TouchableOpacity>
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
        Recently Completed Shows
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
    gap: 8,
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
