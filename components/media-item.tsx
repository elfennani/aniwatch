import Media from "@/interfaces/Media";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Link } from "expo-router";
import Text from "./text";
import { Image, ImageBackground } from "expo-image";
import { useTheme } from "@/ctx/theme-provider";
import Box from "./box";
import { Iconify } from "react-native-iconify";

interface Props {
  canContinue?: boolean;
  media: Media;
  type?: "list" | "grid";
  local?: boolean;
}

const MediaItem = ({
  media: { cover, episodes, id, progress, title },
  canContinue = false,
  type = "list",
  local = false,
}: Props) => {
  const { colors } = useTheme();

  if (type == "grid") {
    return (
      <Link href={local ? `/offline/media/${id}` : `/media/${id}`} asChild>
        <TouchableOpacity activeOpacity={0.8}>
          <ImageBackground
            cachePolicy="memory-disk"
            recyclingKey={id.toString()}
            source={{ uri: cover }}
            style={[styles.gridThumbnail, { backgroundColor: colors.card }]}
            contentFit="cover"
          >
            <View style={styles.gridInfo}>
              <Text numberOfLines={3} variant="label" color="white">
                {title}
              </Text>
              {!!progress && (
                <Text color="primary" variant="small">
                  ({progress}/{episodes})
                </Text>
              )}
            </View>
          </ImageBackground>
        </TouchableOpacity>
      </Link>
    );
  }

  return (
    <Link href={`/media/${id}` as any} asChild>
      <TouchableOpacity activeOpacity={0.8}>
        <Box row rounding="sm" background="card" style={{ overflow: "hidden" }}>
          <Image
            cachePolicy="memory-disk"
            recyclingKey={id.toString()}
            source={{ uri: cover }}
            contentFit="cover"
            style={styles.thumbnail}
          />
          <View style={styles.info}>
            <Text>{title}</Text>
            <View style={styles.progress}>
              {!!progress && (
                <Text variant="label" color="secondary">
                  ({progress}/{episodes})
                </Text>
              )}
              {canContinue && (
                <Link
                  style={styles.continueLink}
                  href={`/watch/${id}/${progress + 1}` as any}
                  asChild
                >
                  <TouchableOpacity activeOpacity={0.7}>
                    <Iconify
                      icon="material-symbols-light:play-circle"
                      size={16}
                      color={colors.primary}
                    />
                    <Text color="primary">Continue Watching</Text>
                  </TouchableOpacity>
                </Link>
              )}
            </View>
          </View>
        </Box>
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  gridThumbnail: {
    aspectRatio: 0.69,
    height: 192,
    borderRadius: 6,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  thumbnail: {
    aspectRatio: 0.69,
    height: 128,
  },
  gridInfo: { backgroundColor: "rgba(0,0,0,0.66)", padding: 8, gap: 4 },
  info: {
    padding: 16,
    justifyContent: "space-between",
    flex: 1,
  },
  continueLink: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  progress: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default MediaItem;
