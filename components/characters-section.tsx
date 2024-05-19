import { StyleSheet, TouchableOpacity } from "react-native";
import React, { useCallback } from "react";
import Character from "@/interfaces/Character";
import Section from "./section";
import Box from "./box";
import Text from "./text";
import { Image } from "expo-image";
import { useTheme } from "@/ctx/theme-provider";
import { Link } from "expo-router";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import theme from "@/constants/theme";

type Props = {
  mediaId: number;
  characters: Character[];
};

const CharactersSection = ({ characters, mediaId }: Props) => {
  const {
    spacing,
    colors: { card },
  } = useTheme();

  const renderItem: ListRenderItem<Character> = useCallback(
    ({ item: ch }) => (
      <Box gap="sm" style={{ alignItems: "center" }}>
        <Box
          background="secondary"
          rounding="full"
          style={{ borderColor: card, borderWidth: 4 }}
        >
          <Image
            cachePolicy="memory-disk"
            recyclingKey={ch.id.toString()}
            source={{ uri: ch.image }}
            style={styles.image}
          />
        </Box>
        <Text style={styles.name} numberOfLines={2} variant="small">
          {ch.fullName}
        </Text>
      </Box>
    ),
    []
  );

  return (
    <Section
      titlePaddingOnly
      title="Characters"
      tailing={
        <Link href={`/media/${mediaId}/characters`} asChild>
          <TouchableOpacity activeOpacity={0.75} hitSlop={16}>
            <Text color="primary" variant="label">
              See All
            </Text>
          </TouchableOpacity>
        </Link>
      }
    >
      <FlashList
        data={characters}
        horizontal
        contentContainerStyle={{
          paddingHorizontal: 32,
        }}
        estimatedItemSize={spacing["6xl"]}
        fadingEdgeLength={100}
        alwaysBounceHorizontal={false}
        ItemSeparatorComponent={() => <Box width="lg" height="lg" />}
        renderItem={renderItem}
      />
    </Section>
  );
};

export default CharactersSection;

const styles = StyleSheet.create({
  image: {
    width: theme.spacing["6xl"],
    height: theme.spacing["6xl"],
    borderRadius: 1000,
  },
  name: { width: theme.spacing["6xl"], textAlign: "center" },
});
