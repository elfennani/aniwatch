import { StyleSheet, useWindowDimensions } from "react-native";
import React, { useCallback } from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  ContentStyle,
  FlashList,
  ListRenderItem,
  MasonryFlashList,
} from "@shopify/flash-list";
import { useTheme } from "@/ctx/theme-provider";
import Box from "@/components/box";
import { router, useLocalSearchParams } from "expo-router";
import useCharactersQuery from "@/api/use-characters-query";
import Character from "@/interfaces/Character";
import { Image } from "expo-image";
import Text from "@/components/text";
import Language from "@/interfaces/Language";
import { useMMKVObject } from "react-native-mmkv";
import Heading from "@/components/heading";

export default function CharactersScreen() {
  const { spacing } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { top: paddingTop, bottom: paddingBottom } = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const [language] = useMMKVObject<Language>("language");
  const { data, fetchNextPage, isFetchingNextPage } = useCharactersQuery({
    lang: language ?? "JAPANESE",
    mediaId: Number(id),
  });
  const renderItem: ListRenderItem<Character> = useCallback(
    ({ item }) => <CharacterItem character={item} />,
    []
  );

  const onEndReached = useCallback(() => {
    if (!isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isFetchingNextPage]);

  const style: ContentStyle = {
    padding: spacing["lg"],
    paddingBottom,
    paddingTop,
  };

  return (
    <MasonryFlashList
      data={data}
      estimatedListSize={{ width, height }}
      contentContainerStyle={style}
      estimatedItemSize={128}
      ListHeaderComponent={
        <Header
          language={language ?? "JAPANESE"}
          onSetLanguage={() => router.push(`/language`)}
        />
      }
      renderItem={renderItem}
      numColumns={3}
      onEndReachedThreshold={0.5}
      onEndReached={onEndReached}
    />
  );
}

const CharacterItem = ({ character }: { character: Character }) => {
  const { spacing } = useTheme();

  return (
    <Box style={{ width: "100%" }} padding="xs">
      <Box rounding="xs" background="card" style={{ overflow: "hidden" }}>
        <Image
          cachePolicy="memory-disk"
          recyclingKey={character.id.toString()}
          source={{ uri: character.image, cacheKey: character.id.toString() }}
          style={{ aspectRatio: 0.69, width: "100%" }}
          contentFit="cover"
        />
        <Box padding="xs" paddingVertical="sm" gap="sm">
          <Text variant="label" style={styles.label}>
            {character.fullName}
          </Text>
          <Text variant="small" color="secondary" style={styles.label}>
            {character.role}
          </Text>
          <Box gap="xs">
            {character.actors?.map((actor) => (
              <Box key={actor.id} gap="xs" row style={{ alignItems: "center" }}>
                <Image
                  cachePolicy="memory-disk"
                  recyclingKey={actor.id.toString()}
                  source={{ uri: actor.image }}
                  style={{
                    width: spacing["xl"],
                    height: spacing["xl"],
                    borderRadius: 100,
                  }}
                />
                <Text
                  variant="small"
                  color="secondary"
                  numberOfLines={1}
                  style={{ flex: 1 }}
                >
                  {actor.name}
                </Text>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

interface HeaderProps {
  onSetLanguage: () => void;
  language: Language;
}

const Header = ({ language, onSetLanguage }: HeaderProps) => (
  <Heading
    name="Characters"
    button
    back
    label={language}
    onPress={onSetLanguage}
  />
);
const styles = StyleSheet.create({
  label: { textTransform: "capitalize", textAlign: "center" },
});
