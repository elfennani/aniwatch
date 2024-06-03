import React, { useCallback } from "react";
import Text from "@/components/text";
import { useTheme } from "@/ctx/theme-provider";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import useSavedQueue from "@/hooks/use-saved-queue";
import useSavedCurrent from "@/hooks/use-saved-current";
import { View, useWindowDimensions } from "react-native";
import useSavedShows from "@/hooks/use-saved-shows";
import DownloadItem from "@/interfaces/DownloadItem";
import DownloadItemProgress from "@/interfaces/DownloadItemProgress";
import SavedShow from "@/interfaces/SavedShow";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import ListingItem from "@/components/listing-item";
import { Iconify } from "react-native-iconify";
import { TouchableOpacity } from "react-native";
import { red, zinc } from "tailwindcss/colors";
import { router } from "expo-router";
import * as FileSystem from "expo-file-system";
import { useMutation } from "@tanstack/react-query";

type Download =
  | (DownloadItem & { type: "queue-item" })
  | (DownloadItemProgress & { type: "downloading" })
  | (SavedShow & { type: "saved" });

const DownloadScreen = () => {
  const { spacing } = useTheme();
  const [queue] = useSavedQueue();
  const [current] = useSavedCurrent();
  const [saved, setSavedShows] = useSavedShows();
  const { top } = useSafeAreaInsets();

  let downloads: Download[] = [];
  if (queue) {
    downloads = queue
      .filter(
        (item) =>
          item.mediaId != current?.mediaId || item.episode != current.episode
      )
      .map((item): Download => ({ ...item, type: "queue-item" }));
  }
  if (current) {
    downloads = [...downloads, { ...current, type: "downloading" }];
  }
  if (saved) {
    const savedMap = saved.map(
      (saved): Download => ({ ...saved, type: "saved" })
    );
    downloads = [...downloads, ...savedMap];
  }

  let shows: number[] = [];
  downloads.forEach((item) => {
    if (!shows.includes(item.mediaId)) shows.push(item.mediaId);
  });

  const listing = shows.reduce((allShows, show) => {
    const title = downloads.find((item) => item.mediaId == show)?.title!;
    const episodes = downloads
      .filter((item) => item.mediaId == show)
      .sort((a, b) => a.episode - b.episode);

    return [...allShows, title, ...episodes];
  }, [] as (string | Download)[]);

  const { mutate: deleteEpisode, isPending } = useMutation({
    mutationKey: ["show", "delete", "episode"],
    mutationFn: async (item: SavedShow) => {
      await FileSystem.deleteAsync(item.uri, { idempotent: true });
      if (item.thumbnail && item.thumbnail.startsWith("file")) {
        await FileSystem.deleteAsync(item.thumbnail, { idempotent: true });
      }

      setSavedShows((savedShows) => {
        return savedShows?.filter((show) => show.uri != item.uri);
      });
    },
  });

  // console.log(saved);

  const renderItem: ListRenderItem<string | Download> = useCallback(
    ({ item }) => {
      if (typeof item == "string") {
        return (
          <View className="flex-row items-center justify-between">
            <Text className="!font-medium text-2xl">{item}</Text>
            <TouchableOpacity
              onPress={() => {
                const id = downloads.find(({ title }) => title == item)
                  ?.mediaId!;
                router.push(`/media/${id}`);
              }}
              hitSlop={16}
            >
              <Text className="text-sm text-zinc-400 dark:text-zinc-600">
                Show Details
              </Text>
            </TouchableOpacity>
          </View>
        );
      }

      let status = `${item.audio.toUpperCase()}`;

      if (item.type == "downloading") {
        const progress = (item.progress * 100).toFixed(2);
        status = `${item.audio.toUpperCase()} • Downloading (${progress}%)`;
      }

      if (item.type == "queue-item") {
        status = `${item.audio.toUpperCase()} • In Queue`;
      }

      return (
        <ListingItem
          onPrimaryPress={() => {
            if (item.type == "saved")
              router.push({
                pathname: "/offline/watch/[id]/[ep]/[uri]",
                params: {
                  id: item.mediaId,
                  ep: item.episode,
                  uri: item.uri,
                },
              });
          }}
          thumbnail={item.thumbnail!}
          title={`Episode ${item.episode}`}
          type="list-alt"
          subtitle={status}
          trailing={
            item.type == "saved" && (
              <TouchableOpacity
                hitSlop={16}
                onPress={() => deleteEpisode(item)}
                disabled={isPending}
              >
                <Iconify
                  icon="material-symbols-light:delete-forever-sharp"
                  size={24}
                  color={isPending ? zinc[500] : red[500]}
                />
              </TouchableOpacity>
            )
          }
        />
      );
    },
    []
  );

  return (
    <FlashList
      data={listing}
      getItemType={(item) => (typeof item === "string" ? "title" : "episode")}
      estimatedItemSize={79}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 24, paddingTop: 24 + top }}
      ItemSeparatorComponent={() => <View className="h-4" />}
    />
  );
};

export default DownloadScreen;
