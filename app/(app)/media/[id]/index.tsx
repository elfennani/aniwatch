import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import React, { useEffect, useMemo } from "react";
import stc from "string-to-color";
import useShowQuery from "@/api/use-show-query";
import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Text from "@/components/text";
import RenderHtml from "react-native-render-html";
import { LinearGradient } from "expo-linear-gradient";
import EpsiodeItem from "@/components/epsiode-item";
import { Link } from "expo-router";
import { Image, ImageBackground } from "expo-image";
import Section from "@/components/section";
import TagsGrid from "@/components/tags-grid";
import MediaRelations from "@/components/media-relations";
import Skeleton from "@/components/skeleton";
import chroma from "chroma-js";
import { useTheme } from "@/ctx/theme-provider";
import Box from "@/components/box";
import CharactersSection from "@/components/characters-section";

type Props = {};

const MediaById = (props: Props) => {
  const { top, bottom } = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    data: media,
    refetch,
    isRefetching,
    isPending,
    isError,
    error,
  } = useShowQuery({ id: Number(id) });
  const { width } = useWindowDimensions();
  const theme = useTheme();
  const headerGradient = useMemo(
    () => [
      chroma(theme.colors.background).alpha(0).css(),
      theme.colors.background,
    ],
    [theme]
  );

  useEffect(() => {
    error && console.log(error);
  }, [error]);

  if (isPending)
    return (
      <View>
        <View style={{ padding: 32, paddingTop: 32 + top, gap: 16 }}>
          <View
            style={{ flexDirection: "row", alignItems: "flex-end", gap: 16 }}
          >
            <Skeleton style={styles.cover} />
            <View style={{ flex: 1, gap: 8 }}>
              <Skeleton height={32} style={{ maxWidth: 175 }} />
              <Skeleton height={16} width={60} />
              <Skeleton height={16} width={120} />
            </View>
          </View>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Skeleton height={24} width={70} />
            <Skeleton height={24} width={65} />
            <Skeleton height={24} width={80} />
          </View>
        </View>
        <Skeleton height={1} radius={0} />
        <View style={{ padding: 32, gap: 16 }}>
          <Skeleton height={24} width={60} />
          <View style={{ gap: 8 }}>
            <Skeleton height={18} />
            <Skeleton height={18} />
            <Skeleton height={18} width="70%" />
          </View>
        </View>
      </View>
    );
  if (isError) return <Text color="failure">Error</Text>;

  function getMediaLength() {
    if (media?.type == "ANIME" && !!media.episodesCount) {
      return `• ${media.episodesCount} Episodes`;
    }
    if (media?.type == "MANGA" && !!media.chapters) {
      return `• ${media.chapters} Chapters`;
    }
  }

  return (
    <ScrollView
      style={{ paddingBottom: bottom }}
      nestedScrollEnabled
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          progressViewOffset={top}
        />
      }
    >
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
      {media.description && (
        <Section title="Synopsis">
          <RenderHtml
            contentWidth={width - 64}
            systemFonts={["regular"]}
            baseStyle={{
              fontFamily: "regular",
              color: theme.colors.foreground,
              fontSize: 12,
              lineHeight: 19.25,
            }}
            source={{ html: media.description }}
          />
        </Section>
      )}
      <CharactersSection mediaId={media.id} characters={media.mainCharacters} />
      {!!media.relations.length && (
        <MediaRelations relations={media.relations} />
      )}
      {media.tags && <TagsGrid tags={media.tags} />}
      {!!media.episodes && (
        <Section title="Episodes" style={{ gap: 8 }}>
          {media.episodes
            .sort((a, b) => a.number - b.number)
            .map((ep) => (
              <Link
                key={ep.id}
                href={`/watch/${media.id}/${ep.number}` as any}
                asChild
              >
                <EpsiodeItem
                  episode={ep}
                  mediaId={media.id}
                  watched={(media.progress ?? 0) >= ep.number}
                />
              </Link>
            ))}
        </Section>
      )}
    </ScrollView>
  );
};

export default MediaById;

const styles = StyleSheet.create({
  cover: {
    aspectRatio: 0.69,
    width: 128,
    borderRadius: 4,
  },
});
