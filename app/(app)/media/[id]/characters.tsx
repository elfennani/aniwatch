import { StyleSheet, TouchableHighlight, View } from "react-native";
import React from "react";
import SectionTitle from "@/components/section-title";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";
import { useTheme } from "@/ctx/theme-provider";
import Box from "@/components/box";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router, useLocalSearchParams } from "expo-router";
import useCharactersQuery from "@/api/use-characters-query";
import Character from "@/interfaces/Character";
import { Image } from "expo-image";
import Text from "@/components/text";

export default function CharactersScreen() {
  const { spacing } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, fetchNextPage, isFetchingNextPage } = useCharactersQuery({
    lang: "JAPANESE",
    mediaId: Number(id),
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlashList
        data={data}
        contentContainerStyle={{ padding: spacing["xl"] }}
        estimatedItemSize={128}
        ListHeaderComponent={<Header />}
        renderItem={({ item }) => <CharacterItem character={item} />}
        numColumns={3}
        // ItemSeparatorComponent={() => <Box width="sm" height="sm" />}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (!isFetchingNextPage) {
            fetchNextPage();
          }
        }}
      />
    </SafeAreaView>
  );
}

const CharacterItem = ({ character }: { character: Character }) => {
  const { spacing } = useTheme();

  return (
    <Box style={{ width: "100%" }} padding="xs">
      <Box rounding="xs" background="card" style={{ overflow: "hidden" }}>
        <Image
          source={{ uri: character.image }}
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

const Header = () => {
  const {
    spacing,
    colors: { card, secondary },
  } = useTheme();

  return (
    <Box
      row
      style={{ alignItems: "center", marginBottom: spacing["lg"] }}
      gap="lg"
    >
      <TouchableHighlight
        underlayColor={card}
        onPress={() => router.canGoBack() && router.back()}
        style={{ borderRadius: 1000 }}
      >
        <Box padding="md">
          <AntDesign name="back" size={24} color={secondary} />
        </Box>
      </TouchableHighlight>
      <SectionTitle>Characters</SectionTitle>
    </Box>
  );
};

const styles = StyleSheet.create({
  label: { textTransform: "capitalize", textAlign: "center" },
});
