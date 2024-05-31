import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { memo } from "react";
import Character from "@/interfaces/Character";
import { FlashList } from "@shopify/flash-list";
import ListingItem from "./listing-item";
import Text from "./text";

type Props = {
  characters: Character[];
};

const MediaCharacters = memo(({ characters }: Props) => {
  return (
    <View className="gap-4">
      <View className="flex-row items-center justify-between px-6">
        <Text className="!font-medium text-2xl">Characters</Text>
        <TouchableOpacity hitSlop={16}>
          <Text className="text-sm text-zinc-400 dark:text-zinc-600">
            See all
          </Text>
        </TouchableOpacity>
      </View>
      <FlashList
        data={characters}
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
            thumbnail={item.image!}
            // onPrimaryPress={() => router.push(`/media/${item.id}`)}
            type="grid"
            title={item.fullName}
            recyclingKey={`cover-${item.id}`}
          />
        )}
      />
    </View>
  );
});

export default MediaCharacters;

const styles = StyleSheet.create({});
