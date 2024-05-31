import { StyleSheet, View, useColorScheme } from "react-native";
import React, { useMemo } from "react";
import stc from "string-to-color";
import Text from "@/components/text";
import { LinearGradient } from "expo-linear-gradient";
import { Image, ImageBackground } from "expo-image";
import chroma from "chroma-js";
import Box from "@/components/box";
import { ShowDetails } from "@/interfaces/ShowDetails";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Iconify } from "react-native-iconify";
import MediaFormat from "@/interfaces/MediaFormat";
import { router } from "expo-router";
import Animated from "react-native-reanimated";

type Props = {
  media: ShowDetails;
};

const MediaHeading = ({ media }: Props) => {
  const { top, bottom } = useSafeAreaInsets();

  const scheme = useColorScheme();

  const headerGradient = useMemo(
    () => [
      chroma(scheme == "light" ? "white" : "black")
        .alpha(0)
        .css(),
      scheme == "light" ? "white" : "black",
    ],
    [scheme]
  );

  const mapFormat: Record<MediaFormat, string> = {
    MANGA: "Manga",
    MOVIE: "Movie",
    MUSIC: "Music",
    NOVEL: "Novel",
    ONA: "ONA",
    ONE_SHOT: "Oneshot",
    OVA: "OVA",
    SPECIAL: "Special",
    TV: "TV",
    TV_SHORT: "TV Short",
  };

  const mapMediaType = {
    ANIME: "Anime",
    MANGA: "Manga",
  };

  return (
    <View className="gap-6 pb-6 bg-white dark:bg-black">
      <ImageBackground
        cachePolicy="memory-disk"
        source={{ uri: media.banner ?? undefined }}
        contentFit="cover"
        recyclingKey={`banner-${media.id}`}
      >
        <LinearGradient
          colors={headerGradient}
          locations={[0.25, 0.95]}
          className="h-[380] justify-end"
          style={{
            paddingTop: top,
            backgroundColor: chroma(scheme == "light" ? "white" : "black")
              .alpha(0.2)
              .css(),
          }}
        >
          <View className="gap-4 items-center">
            <View className="dark:bg-zinc-700 bg-zinc-200 w-[128] aspect-[0.69] rounded-2xl overflow-hidden">
              <Image
                recyclingKey={`cover-${media.id}`}
                transition={150}
                source={{ uri: media.cover }}
                style={{ width: "100%", height: "100%" }}
              />
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
      <View className="gap-1 items-center">
        <Text className="text-2xl font-semibold leading-10">
          {media.title.default ??
            media.title.english ??
            media.title.romaji ??
            media.title.native}
        </Text>
        <Text className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">
          {mapMediaType[media.type]}{" "}
          {media.format && <>• {mapFormat[media.format]}</>}
        </Text>
        <View className="flex-row gap-2 flex-wrap pt-1">
          {media.genres?.map((genre) => (
            <View
              key={genre}
              className="bg-purple-50 dark:bg-zinc-900 px-2 py-1 rounded-full"
            >
              <Text className="text-xs !font-medium !text-purple-400">
                {genre}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
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
