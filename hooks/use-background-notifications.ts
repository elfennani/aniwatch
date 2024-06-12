import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import { GraphQLClient } from "graphql-request";
import { Session } from "@/ctx/session";
import { fetchNotifications } from "@/api/use-notifications-query";
import { storage } from "@/utils/mmkv";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { fetchViewer } from "@/api/use-viewer-query";
import { useCallback, useEffect } from "react";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function registerForNotificationsAsync() {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync("default", {
    name: "default",
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#FF231F7C",
  });

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
  const sessionData = await storage.getString("session");
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


const useBackgroundNotifications = () => {
  useEffect(() => {
    register();
  }, []);

  const register = useCallback(
    async () => {
      if (await registerForNotificationsAsync()) {
        registerBackgroundFetchAsync();
      }
    },
    [],
  )



}

export default useBackgroundNotifications