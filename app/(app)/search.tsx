import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useSearchQuery from "@/api/use-search-query";
import { FlashList } from "@shopify/flash-list";
import MediaItem from "@/components/media-item";
import { Stack } from "expo-router";
import { useTheme } from "@/ctx/theme-provider";
import Box from "@/components/box";
import { Iconify } from "react-native-iconify";

type Props = {};

const SearchScreen = (props: Props) => {
  const { top } = useSafeAreaInsets();
  const [value, setValue] = useState("");
  const [debouced, setDebouced] = useState("");
  const { colors } = useTheme();
  const { data, fetchNextPage, refetch, isRefetching } = useSearchQuery({
    query: debouced,
  });

  useEffect(() => {
    const timeout = setTimeout(() => setDebouced(value), 300);

    return () => clearTimeout(timeout);
  }, [value]);

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
        data={data?.pages.flat()}
        refreshing={isRefetching}
        onRefresh={refetch}
        estimatedItemSize={128}
        contentContainerStyle={{ padding: 16 }}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        renderItem={({ item }) => <MediaItem media={item} type="list" />}
        onEndReached={() => fetchNextPage()}
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
