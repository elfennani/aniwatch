import { StyleSheet, View } from "react-native";
import React, { memo } from "react";
import ShowRelation from "@/interfaces/ShowRelation";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import Text from "./text";
import ListingItem from "./listing-item";

type Props = {
  relations: ShowRelation[];
};

const MediaRelations = memo(({ relations }: Props) => {
  return (
    <View className="gap-4">
      <View className="flex-row items-center justify-between px-6">
        <Text className="!font-medium text-2xl">Relations</Text>
      </View>
      <FlashList
        data={relations}
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
            thumbnail={item.cover}
            onPrimaryPress={() => router.push(`/media/${item.id}`)}
            type="grid"
            title={item.title}
            subtitle={`${item.relationType} • ${item.type}`}
            recyclingKey={`cover-${item.id}`}
          />
        )}
      />
    </View>
  );
});

export default MediaRelations;

const styles = StyleSheet.create({
  gridInfo: { backgroundColor: "rgba(0,0,0,0.66)", padding: 8, gap: 4 },
  gridThumbnail: {
    aspectRatio: 0.69,
    height: 192,
    borderRadius: 6,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
});
