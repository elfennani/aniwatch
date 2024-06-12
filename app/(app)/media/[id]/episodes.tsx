import { View, TouchableOpacity, useWindowDimensions } from "react-native";
import React, { useCallback, useMemo, useState } from "react";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import ListingItem from "@/components/listing-item";
import { router, useLocalSearchParams } from "expo-router";
import { Iconify } from "react-native-iconify";
import { purple, zinc } from "tailwindcss/colors";
import useShowQuery from "@/api/use-show-query";
import MediaHeading from "@/components/media-heading";
import { Episode } from "@/interfaces/Episode";
import { useDownloadManager } from "@/ctx/download-manager";
import Options from "@/components/options";
import DownloadIconButton from "@/components/download-icon-button";
import { Platform } from "react-native";

type Props = {};

const MediaEpisodesScreen = (props: Props) => {
  const { id } = useLocalSearchParams();
  const dimensions = useWindowDimensions();
  const { push } = useDownloadManager();
  const [episode, setEpisode] = useState<Episode>();
  const {
    data: media,
    refetch,
    isRefetching,
    isPending,
    isError,
  } = useShowQuery({ id: Number(id) });

  const downloadEpisode = (episode: Episode, audio: "sub" | "dub") => {
    push({
      allAnimeId: media?.allanimeId!,
      audio,
      episode: episode.number,
      mediaId: media?.id!,
      title: media?.title.default!,
      thumbnail: episode.thumbnail,
    });
  };

  const renderItem: ListRenderItem<Episode> = useCallback(
    ({ item: episode }) => (
      <View className="px-6 web:container web:mx-auto">
        <ListingItem
          onPrimaryPress={() => router.push(`/watch/${id}/${episode.number}`)}
          thumbnail={episode.thumbnail!}
          title={`Episode ${episode.number}`}
          type="list-alt"
          subtitle={`${Math.round((episode.duration ?? 0) / 60)}min ${
            (episode.dub && `• DUB`) || ""
          }`}
          trailing={
            <DownloadIconButton
              episode={episode}
              mediaId={media?.id!}
              onPress={() => {
                if (episode.dub) {
                  setEpisode(episode);
                  return;
                }
                downloadEpisode(episode, "sub");
              }}
            />
          }
        />
      </View>
    ),
    []
  );

  const listHeader = useMemo(() => <MediaHeading media={media!} />, [media]);

  const subIcon = (
    <Iconify
      icon="material-symbols-light:language-japanese-kana"
      size={24}
      color={zinc[300]}
    />
  );

  const dubIcon = (
    <Iconify
      icon="material-symbols-light:language-us-sharp"
      size={24}
      color={zinc[300]}
    />
  );

  return (
    <View className="native:flex-1">
      <Options visible={!!episode} onClose={() => setEpisode(undefined)}>
        <Options.Option
          title="Download Sub"
          icon={subIcon}
          onPress={() => downloadEpisode(episode!, "sub")}
        />
        <Options.Option
          title="Download Dub"
          icon={dubIcon}
          onPress={() => downloadEpisode(episode!, "dub")}
        />
      </Options>
      <FlashList
        data={media?.episodes?.sort((a, b) => a.number - b.number)}
        contentContainerStyle={{ paddingBottom: 24 }}
        estimatedItemSize={79}
        estimatedListSize={dimensions}
        ItemSeparatorComponent={() => <View className="h-4" />}
        ListHeaderComponent={(Platform.OS !== "web" && listHeader) || undefined}
        renderItem={renderItem}
      />
    </View>
  );
};

export default MediaEpisodesScreen;
