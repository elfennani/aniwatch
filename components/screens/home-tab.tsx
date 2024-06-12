import {
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import React, { useCallback, useState } from "react";
import useViewerQuery from "@/api/use-viewer-query";
import MediaStatus from "@/interfaces/MediaStatus";
import Text from "../text";
import { FlashList, ViewToken } from "@shopify/flash-list";
import ListingItem from "../listing-item";
import cn from "@/utils/cn";
import { useRouter } from "expo-router";
import useMediaListing from "@/api/use-media-listing";
import useHomeMedia from "@/api/use-home-media";
import { Button } from "react-native";
import { documentDirectory } from "expo-file-system";

type Props = {
  viewerId: number;
  onPushTab: (tab: string) => void;
};

const status: MediaStatus[] = ["CURRENT", "COMPLETED", "PLANNING"];

type ViewablityChangeCallback = (info: {
  viewableItems: ViewToken[];
  changed: ViewToken[];
}) => void;

const HomeTab = ({ viewerId, onPushTab }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const { width } = useWindowDimensions();

  const {
    data: media,
    isError: isMediaError,
    isPending: isMediaPending,
    isRefetching: isMediaRefetching,
    refetch: refetchMedia,
    error: mediaError,
  } = useHomeMedia({
    userId: viewerId,
  });

  const cardWidth = width > 320 ? 320 : width - 52;

  const onChangeViewable: ViewablityChangeCallback = useCallback(
    ({ viewableItems }) => {
      if (viewableItems.length) {
        setActiveIndex(viewableItems[0].index ?? 0);
      }
    },
    [activeIndex]
  );

  if (!media) return <Text>Loading...</Text>;

  return (
    <ScrollView
      contentContainerClassName="py-4 gap-6"
      refreshControl={
        <RefreshControl
          refreshing={isMediaRefetching}
          onRefresh={refetchMedia}
        />
      }
    >
      {__DEV__ && Platform.OS !== "web" && (
        <Button
          title="files"
          onPress={() =>
            router.push({
              pathname: "/file-browser/[path]",
              params: {
                path: documentDirectory,
              },
            })
          }
        />
      )}

      <View>
        <FlashList
          data={media.Watching}
          pagingEnabled
          snapToInterval={cardWidth + 24}
          estimatedItemSize={cardWidth}
          nestedScrollEnabled
          decelerationRate="normal"
          showsHorizontalScrollIndicator={false}
          horizontal
          contentContainerClassName="native:p-6"
          onViewableItemsChanged={onChangeViewable}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 50,
            waitForInteraction: true,
          }}
          ItemSeparatorComponent={() => <View style={{ width: 24 }} />}
          renderItem={({ item }) => (
            <ListingItem
              onPrimaryPress={() =>
                router.push(`/watch/${item.id}/${item.progress + 1}`)
              }
              onSecondaryPress={() => {
                requestAnimationFrame(() => {
                  router.push(`/media/${item.id}`);
                });
              }}
              style={{ width: cardWidth }}
              thumbnail={item.hdCover || item.cover}
              subtitle={item.title}
              type="carousel"
              title={`Episode ${item.progress + 1}`}
              recyclingKey={`cover-${item.id}`}
            />
          )}
        />
        <View className="py-3 pt-6 flex-row gap-2 items-center justify-center web:hidden">
          {Array(media.Watching.length)
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
      <View className="flex-row items-center justify-between native:px-6">
        <Text className="!font-medium text-2xl">Recently Completed</Text>
        <TouchableOpacity hitSlop={16} onPress={() => onPushTab("completed")}>
          <Text className="text-sm text-zinc-400 dark:text-zinc-600">
            See all
          </Text>
        </TouchableOpacity>
      </View>

      <FlashList
        data={media.Completed}
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
            onPrimaryPress={() => {
              requestAnimationFrame(() => {
                router.push(`/media/${item.id}`);
              });
            }}
            type="grid"
            title={item.title}
            recyclingKey={`cover-${item.id}`}
          />
        )}
      />

      <View className="flex-row items-center justify-between native:px-6">
        <Text className="!font-medium text-2xl">Planned to Watch</Text>
        <TouchableOpacity hitSlop={16} onPress={() => onPushTab("planned")}>
          <Text className="text-sm text-zinc-400 dark:text-zinc-600">
            See all
          </Text>
        </TouchableOpacity>
      </View>

      <FlashList
        data={media.Planned}
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
            onPrimaryPress={() => {
              requestAnimationFrame(() => {
                router.push(`/media/${item.id}`);
              });
            }}
            type="grid"
            title={item.title}
            recyclingKey={`cover-${item.id}`}
          />
        )}
      />
    </ScrollView>
  );
};

export default HomeTab;

const styles = StyleSheet.create({});
