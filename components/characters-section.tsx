import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import Character from "@/interfaces/Character";
import Section from "./section";
import Box from "./box";
import Text from "./text";
import { Image } from "expo-image";
import { useTheme } from "@/ctx/theme-provider";
import { Link } from "expo-router";

type Props = {
  mediaId: number;
  characters: Character[];
};

const CharactersSection = ({ characters, mediaId }: Props) => {
  const {
    spacing,
    colors: { card },
  } = useTheme();
  return (
    <Section
      titlePaddingOnly
      title="Characters"
      tailing={
        <Link href={`/media/${mediaId}/characters`} asChild>
          <TouchableOpacity activeOpacity={0.75}>
            <Text color="primary" variant="label">
              See All
            </Text>
          </TouchableOpacity>
        </Link>
      }
    >
      <ScrollView
        horizontal
        contentContainerStyle={{ gap: 16, paddingHorizontal: 32 }}
        showsHorizontalScrollIndicator={false}
      >
        {characters?.map((ch) => (
          <Box key={ch.id} gap="sm" style={{ alignItems: "center" }}>
            <Box
              background="secondary"
              rounding="full"
              style={{ borderColor: card, borderWidth: 4 }}
            >
              <Image
                source={{ uri: ch.image }}
                style={{
                  width: spacing["6xl"],
                  height: spacing["6xl"],
                  borderRadius: 1000,
                }}
              />
            </Box>
            <Text
              style={{ width: spacing["6xl"], textAlign: "center" }}
              numberOfLines={2}
              variant="small"
            >
              {ch.fullName}
            </Text>
          </Box>
        ))}
      </ScrollView>
    </Section>
  );
};

export default CharactersSection;

const styles = StyleSheet.create({});
