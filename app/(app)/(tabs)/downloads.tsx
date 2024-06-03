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
import { red } from "tailwindcss/colors";

// type Download = (DownloadItem |
//   DownloadItemProgress |
//   SavedShow ) & { type: "downloaded" | "queue-item" | "current-download" };

type Download =
  | (DownloadItem & { type: "queue-item" })
  | (DownloadItemProgress & { type: "downloading" })
  | (SavedShow & { type: "saved" });

const DownloadScreen = () => {
  const { spacing } = useTheme();
  const [queue] = useSavedQueue();
  const [current] = useSavedCurrent();
  const [saved] = useSavedShows();
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

  const renderItem: ListRenderItem<string | Download> = useCallback(
    ({ item }) => {
      if (typeof item == "string") {
        return <Text className="font-semibold">{item}</Text>;
      }

      let status = `${item.audio.toUpperCase()}`;

      if (item.type == "downloading") {
        status = `${item.audio.toUpperCase()} • Downloading (${(
          item.progress * 100
        ).toFixed(2)}%)`;
      }

      if (item.type == "queue-item") {
        status = `${item.audio.toUpperCase()} • In Queue`;
      }

      return (
        <ListingItem
          // onPrimaryPress={() => router.push(`/watch/${id}/${episode.number}`)}
          thumbnail={item.thumbnail!}
          title={`Episode ${item.episode}`}
          type="list-alt"
          subtitle={status}
          trailing={
            <TouchableOpacity hitSlop={16}>
              <Iconify
                icon="material-symbols-light:delete-forever-sharp"
                size={24}
                color={red[500]}
              />
            </TouchableOpacity>
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
