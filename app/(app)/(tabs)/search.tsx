import { Button, Platform, StyleSheet, TextInput, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useSearchQuery from "@/api/use-search-query";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import MediaItem from "@/components/media-item";
import { Stack, router } from "expo-router";
import { useTheme } from "@/ctx/theme-provider";
import Box from "@/components/box";
import { Iconify } from "react-native-iconify";
import Media from "@/interfaces/Media";
import ListingItem from "@/components/listing-item";
import { purple } from "tailwindcss/colors";

type Props = {};

const SearchScreen = (props: Props) => {
  const { top } = useSafeAreaInsets();
  const [value, setValue] = useState("");
  const [debouced, setDebouced] = useState("");
  const { colors } = useTheme();
  const { data, fetchNextPage, refetch, isRefetching, isFetchingNextPage } =
    useSearchQuery({
      query: debouced,
    });

  useEffect(() => {
    const timeout = setTimeout(() => setDebouced(value), 300);

    return () => clearTimeout(timeout);
  }, [value]);

  const renderItem: ListRenderItem<Media> = useCallback(
    ({ item: media }) => (
      <ListingItem
        thumbnail={media.cover}
        status={media.status}
        subtitle={
          media.status == "DROPPED"
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
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ animation: "fade_from_bottom" }} />
      <Box
        background="card"
        row
        paddingHorizontal="lg"
        gap="md"
        style={{ paddingTop: top + 16, alignItems: "center" }}
      >
        <Iconify
          icon="material-symbols-light:search"
          size={24}
          color={colors.secondary}
        />
        <TextInput
          placeholder="Attack on Titan Season 2..."
          placeholderTextColor={colors.secondary}
          style={[styles.input, { color: colors.foreground }]}
          onChangeText={setValue}
          value={value}
          autoFocus
        />
      </Box>
      <FlashList
        contentContainerStyle={{ padding: 24 }}
        data={data?.pages.flat()}
        renderItem={renderItem}
        ItemSeparatorComponent={() => (
          <View style={{ height: 16, width: 16 }} />
        )}
        estimatedItemSize={151}
        refreshing={isRefetching}
        onRefresh={() => refetch()}
        onEndReachedThreshold={1.5}
        onEndReached={() => {
          if (
            !isFetchingNextPage &&
            Platform.OS != "web" &&
            data?.pages.flat().length
          )
            fetchNextPage();
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
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  input: {
    fontFamily: "regular",
    paddingVertical: 12,
    flex: 1,
  },
});
