import { View, TouchableOpacity, useWindowDimensions } from "react-native";
import React, { useCallback, useMemo } from "react";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import ListingItem from "@/components/listing-item";
import { router, useLocalSearchParams } from "expo-router";
import { Iconify } from "react-native-iconify";
import { purple } from "tailwindcss/colors";
import useShowQuery from "@/api/use-show-query";
import MediaHeading from "@/components/media-heading";
import { Episode } from "@/interfaces/Episode";

type Props = {};

const MediaEpisodesScreen = (props: Props) => {
  const { id } = useLocalSearchParams();
  const dimensions = useWindowDimensions();
  const {
    data: media,
    refetch,
    isRefetching,
    isPending,
    isError,
  } = useShowQuery({ id: Number(id) });

  const renderItem: ListRenderItem<Episode> = useCallback(
    ({ item: episode }) => (
      <View className="px-6">
        <ListingItem
          onPrimaryPress={() => router.push(`/watch/${id}/${episode.number}`)}
          thumbnail={episode.thumbnail!}
          title={`Episode ${episode.number}`}
          type="list-alt"
          subtitle={`${Math.round((episode.duration ?? 0) / 60)}min ${
            (episode.dub && `• DUB`) || ""
          }`}
          trailing={
            <TouchableOpacity hitSlop={16}>
              <Iconify
                icon="material-symbols-light:download"
                size={24}
                color={purple[400]}
              />
            </TouchableOpacity>
          }
        />
      </View>
    ),
    []
  );

  const listHeader = useMemo(() => <MediaHeading media={media!} />, [media]);

  return (
    <FlashList
      data={media?.episodes?.sort((a, b) => a.number - b.number)}
      contentContainerStyle={{ paddingBottom: 24 }}
      estimatedItemSize={79}
      estimatedListSize={dimensions}
      ItemSeparatorComponent={() => <View className="h-4" />}
      ListHeaderComponent={listHeader}
      renderItem={renderItem}
    />
  );
};

export default MediaEpisodesScreen;
