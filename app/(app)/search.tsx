import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import zinc from "@/utils/zinc";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useSearchQuery from "@/api/use-search-query";
import { FlashList } from "@shopify/flash-list";
import MediaItem from "@/components/media-item";
import { Stack } from "expo-router";

type Props = {};

const SearchScreen = (props: Props) => {
  const { top } = useSafeAreaInsets();
  const [value, setValue] = useState("");
  const [debouced, setDebouced] = useState("");
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
      <View style={[styles.search, { paddingTop: top + 16 }]}>
        <AntDesign name="search1" size={24} color={zinc[400]} />
        <TextInput
          placeholder="Attack on Titan Season 2..."
          placeholderTextColor={zinc[400]}
          style={styles.input}
          onChangeText={setValue}
          value={value}
          autoFocus
        />
      </View>
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
  search: {
    backgroundColor: zinc[800],
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
    alignItems: "center",
  },
  input: {
    fontFamily: "regular",
    paddingVertical: 12,
    flex: 1,
    color: zinc[100],
  },
});
