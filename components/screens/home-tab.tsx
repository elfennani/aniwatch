import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import React, { useCallback, useState } from "react";
import useViewerQuery from "@/api/use-viewer-query";
import useMediaByStatusQuery from "@/api/use-media-by-status-query";
import MediaStatus from "@/interfaces/MediaStatus";
import Text from "../text";
import { FlashList, ViewToken } from "@shopify/flash-list";
import ListingItem from "../listing-item";
import cn from "@/utils/cn";
import { useRouter } from "expo-router";

type Props = {};

const status: MediaStatus[] = ["CURRENT", "COMPLETED", "PLANNING"];

type ViewablityChangeCallback = (info: {
  viewableItems: ViewToken[];
  changed: ViewToken[];
}) => void;

const HomeTab = (props: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const { width } = useWindowDimensions();
  const {
    data: viewer,
    isError: isViewerError,
    isPending: isViewerPending,
    isRefetching: isViewerRefetching,
    refetch: refetchViewer,
    error: viewerError,
  } = useViewerQuery();
  const {
    data: media,
    isError: isMediaError,
    isPending: isMediaPending,
    isRefetching: isMediaRefetching,
    refetch: refetchMedia,
    error: mediaError,
  } = useMediaByStatusQuery(
    { viewer: viewer?.id!, status, infinite: false, max: 10 },
    !viewer
  );

  const cardWidth = width > 320 ? 320 : width - 52;

  const onChangeViewable: ViewablityChangeCallback = useCallback(
    ({ viewableItems }) => {
      if (viewableItems.length) {
        setActiveIndex(viewableItems[0].index ?? 0);
      }
    },
    [activeIndex]
  );

  if (!viewer || !media) return <Text>Loading...</Text>;

  return (
    <ScrollView contentContainerClassName="py-4 gap-6">
      <View>
        <FlashList
          data={media.CURRENT}
          pagingEnabled
          snapToInterval={cardWidth + 24}
          estimatedItemSize={cardWidth}
          nestedScrollEnabled
          decelerationRate="normal"
          showsHorizontalScrollIndicator={false}
          horizontal
          contentContainerClassName="p-6"
          onViewableItemsChanged={onChangeViewable}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 50,
            waitForInteraction: true,
          }}
          ItemSeparatorComponent={() => <View style={{ width: 24 }} />}
          renderItem={({ item }) => (
            <ListingItem
              onSecondaryPress={() => router.push(`/media/${item.id}`)}
              style={{ width: cardWidth }}
              thumbnail={item.cover}
              subtitle={item.title}
              type="carousel"
              title={`Episode ${item.progress + 1}`}
            />
          )}
        />
        <View className="py-3 pt-6 flex-row gap-2 items-center justify-center">
          {Array(media.CURRENT?.length)
            .fill(0)
            .map((_, i) => (
              <View
                key={i}
                className={cn(
                  "w-1 h-1 bg-zinc-300 rounded",
                  i == activeIndex && "bg-zinc-600"
                )}
              />
            ))}
        </View>
      </View>
      <View className="flex-row items-center justify-between px-6">
        <Text className="!font-medium text-2xl">Recently Completed</Text>
        <TouchableOpacity hitSlop={16}>
          <Text className="text-sm text-zinc-400 dark:text-zinc-600">
            See all
          </Text>
        </TouchableOpacity>
      </View>

      <FlashList
        data={media.COMPLETED}
        pagingEnabled
        snapToInterval={96 + 16}
        estimatedItemSize={96}
        nestedScrollEnabled
        decelerationRate="normal"
        showsHorizontalScrollIndicator={false}
        horizontal
        contentContainerClassName="p-6"
        ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
        renderItem={({ item }) => (
          <ListingItem
            style={{ width: cardWidth }}
            thumbnail={item.cover}
            onPrimaryPress={() => router.push(`/media/${item.id}`)}
            type="grid"
            title={item.title}
          />
        )}
      />

      <View className="flex-row items-center justify-between px-6">
        <Text className="!font-medium text-2xl">Planned to Watch</Text>
        <TouchableOpacity hitSlop={16}>
          <Text className="text-sm text-zinc-400 dark:text-zinc-600">
            See all
          </Text>
        </TouchableOpacity>
      </View>

      <FlashList
        data={media.PLANNING}
        pagingEnabled
        snapToInterval={96 + 16}
        estimatedItemSize={96}
        nestedScrollEnabled
        decelerationRate="normal"
        showsHorizontalScrollIndicator={false}
        horizontal
        contentContainerClassName="p-6"
        ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
        renderItem={({ item }) => (
          <ListingItem
            style={{ width: cardWidth }}
            thumbnail={item.cover}
            onPrimaryPress={() => router.push(`/media/${item.id}`)}
            type="grid"
            title={item.title}
          />
        )}
      />
    </ScrollView>
  );
};

export default HomeTab;

const styles = StyleSheet.create({});
