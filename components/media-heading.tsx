import { StyleSheet } from "react-native";
import React, { useMemo } from "react";
import stc from "string-to-color";
import Text from "@/components/text";
import { LinearGradient } from "expo-linear-gradient";
import { Image, ImageBackground } from "expo-image";
import chroma from "chroma-js";
import Box from "@/components/box";
import { ShowDetails } from "@/interfaces/ShowDetails";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { useTheme } from "@react-navigation/native";

type Props = {
  media: ShowDetails;
};

const MediaHeading = ({ media }: Props) => {
  const { top, bottom } = useSafeAreaInsets();

  const theme = useTheme();
  const headerGradient = useMemo(
    () => [
      chroma(theme.colors.background).alpha(0).css(),
      theme.colors.background,
    ],
    [theme]
  );

  function getMediaLength() {
    if (media?.type == "ANIME" && !!media.episodesCount) {
      return `• ${media.episodesCount} Episodes`;
    }
    if (media?.type == "MANGA" && !!media.chapters) {
      return `• ${media.chapters} Chapters`;
    }
  }

  return (
    <ImageBackground
      source={{ uri: media.banner ?? undefined }}
      contentFit="cover"
    >
      <LinearGradient
        colors={headerGradient}
        locations={[0.25, 0.95]}
        style={{
          padding: 32,
          paddingTop: 32 + top,
          backgroundColor: chroma(theme.colors.background).alpha(0.2).css(),
        }}
      >
        <Box gap="lg" row>
          <Image
            style={styles.cover}
            source={{ uri: media.cover }}
            contentFit="cover"
          />
          <Box gap="xs" flex style={{ justifyContent: "flex-end" }}>
            <Text style={{ fontSize: 18 }}>
              {media.title.default ??
                media.title.english ??
                media.title.romaji ??
                media.title.native}
            </Text>
            {media.year && (
              <Text variant="label" color="secondary">
                {media.year}
              </Text>
            )}
            <Text
              variant="label"
              color="secondary"
              style={{ textTransform: "capitalize" }}
            >
              {media.type} {getMediaLength()}
            </Text>
          </Box>
        </Box>
        {media.genres && (
          <Box row wrap gap="sm" paddingVertical="lg">
            {media.genres.map((genre) => (
              <Box
                key={genre}
                rounding="xs"
                padding="xs"
                style={{ backgroundColor: stc(genre) }}
              >
                <Text style={{ color: "white" }} variant="label">
                  {genre}
                </Text>
              </Box>
            ))}
          </Box>
        )}
      </LinearGradient>
    </ImageBackground>
  );
};

export default MediaHeading;

const styles = StyleSheet.create({
  cover: {
    aspectRatio: 0.69,
    width: 128,
    borderRadius: 4,
  },
});
