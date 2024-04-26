import AntDesign from "@expo/vector-icons/AntDesign";
import Media from "@/interfaces/Media";
import React from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import zinc from "@/utils/zinc";
import { Link } from "expo-router";
import purple from "@/utils/purple";
import Text from "./text";

interface Props {
  canContinue?: boolean;
  media: Media;
  type?: "list" | "grid";
}

const MediaItem = ({
  media: { cover, episodes, id, progress, title },
  canContinue = false,
  type = "list",
}: Props) => {
  if (type == "grid") {
    return (
      <Link href={`/media/${id}` as any} asChild>
        <TouchableOpacity activeOpacity={0.8}>
          <ImageBackground source={{ uri: cover }} style={styles.gridThumbnail}>
            <View style={styles.gridInfo}>
              <Text numberOfLines={3} style={styles.gridTitle}>
                {title}
              </Text>
              {!!progress && (
                <Text style={styles.gridProgress}>
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
        <View style={styles.container}>
          <Image source={{ uri: cover }} style={styles.thumbnail} />
          <View style={styles.info}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.progress}>
              {!!progress && (
                <Text style={styles.progressText}>
                  ({progress}/{episodes})
                </Text>
              )}
              {canContinue && (
                <Link
                  style={styles.continueLink}
                  href={`/watch/${id}/sub/${progress + 1}` as any}
                >
                  <AntDesign name="play" size={14} />
                  <Text style={styles.continueText}>Continue Watching</Text>
                </Link>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  gridThumbnail: {
    aspectRatio: 0.69,
    backgroundColor: zinc[800],
    height: 192,
    borderRadius: 6,
    overflow: "hidden",
    resizeMode: "cover",
    justifyContent: "flex-end",
  },
  title: {
    color: zinc[200],
  },
  gridTitle: {
    color: zinc[200],
    fontSize: 12,
  },
  container: {
    flexDirection: "row",
    backgroundColor: zinc[800],
    borderRadius: 6,
    overflow: "hidden",
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
  continueText: {
    color: purple[500],
    textDecorationLine: "underline",
    textDecorationColor: purple[500],
    fontSize: 14,
  },
  progress: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  progressText: {
    fontSize: 12,
    color: zinc[500],
  },
  gridProgress: { color: purple[300], fontSize: 10 },
});

export default MediaItem;
