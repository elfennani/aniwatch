import { View, Text, Platform, Button } from "react-native";
import React, { useCallback } from "react";
import useMediaListing from "@/api/use-media-listing";
import MediaStatus from "@/interfaces/MediaStatus";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import Media from "@/interfaces/Media";
import ListingItem from "../listing-item";
import { router } from "expo-router";
import { purple } from "tailwindcss/colors";

type Props = {
  viewerId: number;
  status: MediaStatus;
};

const MediaByStatus = (props: Props) => {
  const { data, fetchNextPage, isFetchingNextPage } = useMediaListing({
    status: props.status,
    userId: props.viewerId,
    sort: ["FINISHED_ON_DESC"],
  });

  const renderItem: ListRenderItem<Media> = useCallback(
    ({ item: media }) => (
      <ListingItem
        thumbnail={media.cover}
        status={props.status}
        subtitle={
          props.status == "DROPPED"
            ? `Watched ${media.progress} / ${media.episodes}`
            : `${media.episodes} Episodes`
        }
        onPrimaryPress={() => {
          router.push(`/media/${media.id}`);
        }}
        type="list"
        title={media.title}
        recyclingKey={`cover-${media.id}`}
      />
    ),
    []
  );

  return (
    <FlashList
      contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
      data={data}
      renderItem={renderItem}
      ItemSeparatorComponent={() => <View style={{ height: 16, width: 16 }} />}
      estimatedItemSize={151}
      onEndReachedThreshold={1.5}
      onEndReached={() => {
        if (!isFetchingNextPage && Platform.OS != "web") fetchNextPage();
      }}
      ListFooterComponent={
        Platform.OS == "web"
          ? () => (
              <View className="py-4 w-28 self-center">
                <Button
                  title="More"
                  onPress={() => fetchNextPage()}
                  color={purple[500]}
                />
              </View>
            )
          : undefined
      }
    />
  );
};

export default MediaByStatus;
