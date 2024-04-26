import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import React from "react";
import stc from "string-to-color";
import useShowQuery from "@/api/use-show-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Text from "@/components/text";
import RenderHtml from "react-native-render-html";
import { LinearGradient } from "expo-linear-gradient";
import zinc from "@/utils/zinc";
import EpsiodeItem from "@/components/epsiode-item";
import { Link } from "expo-router";
import { Image, ImageBackground } from "expo-image";

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
  } = useShowQuery({ id: Number(id) });
  const { width } = useWindowDimensions();

  if (isPending) return <Text>Loading...</Text>;
  if (isError) return <Text>Error</Text>;

  return (
    <ScrollView
      style={{ paddingBottom: bottom }}
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
          colors={["rgba(39, 39, 42, 0)", zinc[900]]}
          locations={[0.25, 0.95]}
          style={[styles.gradient, { paddingTop: 32 + top }]}
        >
          <View style={styles.header}>
            <Image
              style={styles.cover}
              source={{ uri: media.cover }}
              contentFit="cover"
            />
            <View style={styles.info}>
              <Text style={{ fontSize: 18 }}>{media.title}</Text>
              <Text style={{ fontSize: 12, color: zinc[300] }}>
                {media.year}
              </Text>
              <Text style={{ fontSize: 12, color: zinc[300] }}>
                {media.type} • {media.episodesCount} Episodes
              </Text>
            </View>
          </View>
          <View style={styles.genreContainer}>
            {media.genres?.map((genre) => (
              <View
                key={genre}
                style={[styles.genre, { backgroundColor: stc(genre) }]}
              >
                <Text weight="semibold" style={styles.genreText}>
                  {genre}
                </Text>
              </View>
            ))}
          </View>
        </LinearGradient>
      </ImageBackground>
      <View style={{ padding: 32 }}>
        <Text weight="semibold" style={{ fontSize: 14, marginBottom: 16 }}>
          Synopsis
        </Text>
        <RenderHtml
          contentWidth={width - 64}
          systemFonts={["regular"]}
          baseStyle={{
            fontFamily: "regular",
            color: zinc[100],
            fontSize: 12,
            lineHeight: 19.25,
          }}
          source={{ html: media.description }}
        />
      </View>
      {!!media.episodes && (
        <View style={{ padding: 32 }}>
          <Text weight="semibold" style={{ fontSize: 14, marginBottom: 16 }}>
            Episodes
          </Text>
          <View style={{ gap: 8 }}>
            {media.episodes
              .sort((a, b) => a.number - b.number)
              .map((ep) => (
                <Link
                  key={ep.id}
                  href={`/watch/${media.id}/${ep.number}` as any}
                  asChild
                >
                  <EpsiodeItem episode={ep} mediaId={media.id} />
                </Link>
              ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default MediaById;

const styles = StyleSheet.create({
  info: {
    justifyContent: "flex-end",
    gap: 4,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    gap: 16,
  },
  gradient: {
    padding: 32,
    backgroundColor: "rgba(39, 39, 42, 0.2)",
  },
  cover: {
    aspectRatio: 0.69,
    width: 128,
    borderRadius: 4,
  },
  genreContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 16,
  },
  genre: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  genreText: {
    fontSize: 12,
  },
});
