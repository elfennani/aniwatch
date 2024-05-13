import {
  DimensionValue,
  StyleSheet,
  TouchableHighlight,
  TouchableHighlightProps,
  TouchableOpacity,
  View,
} from "react-native";
import React, { ReactNode } from "react";
import { AVPlaybackStatus, Video } from "expo-av";
import Text from "./text";
import { Iconify } from "react-native-iconify";
import Box from "./box";
import { usePlayerData } from "@/ctx/player-data";
import { useTheme } from "@/ctx/theme-provider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import secondsToHms from "@/utils/seconds-to-hms";
import chroma from "chroma-js";
import { Image } from "expo-image";
import theme from "@/constants/theme";
import { router } from "expo-router";

type Props = {
  visible: boolean;
  videoRef: React.RefObject<Video>;
  status: AVPlaybackStatus | undefined;
};

const PlayerControls = ({ status, videoRef: video, visible }: Props) => {
  const { backward, forward, togglePlayback } = useControls(status, video);
  const { title, episode, nextEpisode, id } = usePlayerData();
  const {
    spacing,
    colors: { primary: backgroundColor },
  } = useTheme();
  const { top, bottom } = useSafeAreaInsets();
  if (!status?.isLoaded || !visible) return;

  const playbackIcon = status.isPlaying ? (
    <Iconify icon="material-symbols-light:pause" size={48} color="white" />
  ) : (
    <Iconify icon="material-symbols-light:play-arrow" size={64} color="white" />
  );

  const progressPercent = status.durationMillis
    ? (status?.positionMillis / status.durationMillis) * 100
    : 0;

  const playablePercent =
    status.durationMillis && status.playableDurationMillis
      ? (status?.playableDurationMillis / status.durationMillis) * 100
      : 0;

  const progress: DimensionValue = `${progressPercent}%`;
  const playable: DimensionValue = `${playablePercent}%`;

  const duration =
    status.durationMillis && secondsToHms(status.durationMillis / 1000);
  const position = secondsToHms(status.positionMillis / 1000);

  console.log(status);

  return (
    <View style={[StyleSheet.absoluteFill, styles.container]}>
      <Box
        row
        gap="md"
        style={[styles.header, { paddingTop: spacing.lg + top }]}
        paddingHorizontal="xl"
      >
        <Iconify
          icon="material-symbols-light:slideshow-sharp"
          size={24}
          color="white"
        />
        <Box>
          <Text color="white">{title}</Text>
          <Text variant="label" color="faded">
            Episode {episode}
          </Text>
        </Box>
      </Box>
      <Box style={[StyleSheet.absoluteFill, styles.controls]} row>
        <Button
          padding={4}
          onPress={() => backward()}
          onLongPress={() => backward(true)}
        >
          <Iconify
            icon="material-symbols-light:skip-previous"
            size={32}
            color="white"
          />
        </Button>
        <Button padding={status.isPlaying ? 8 : 0} onPress={togglePlayback}>
          {playbackIcon}
        </Button>
        <Button
          padding={4}
          onPress={() => forward()}
          onLongPress={() => forward(true)}
        >
          <Iconify
            icon="material-symbols-light:skip-next"
            size={32}
            color="white"
          />
        </Button>
      </Box>
      <Box
        gap="md"
        style={{ paddingBottom: spacing.lg + bottom }}
        paddingHorizontal="xl"
      >
        <Box>
          <Text variant="label" color="white">
            {position}{" "}
            {duration && (
              <Text variant="label" color="faded">
                / {duration}
              </Text>
            )}
          </Text>
        </Box>
        <Box style={{ position: "relative", justifyContent: "center" }}>
          <Box rounding="full" style={styles.progressContainer}>
            <Box
              style={{
                height: 2,
                backgroundColor,
                width: progress,
                position: "absolute",
                top: 0,
                left: 0,
              }}
            />
            <Box
              style={{
                height: 2,
                backgroundColor: chroma("#fff").alpha(0.25).css(),
                width: playable,
              }}
            />
          </Box>
          <Box
            width="md"
            height="md"
            rounding="full"
            background="primary"
            style={{ position: "absolute", left: progress }}
          />
        </Box>
        <Box row style={styles.footer}>
          <Text color="white">PlayerControls</Text>
          {nextEpisode && (
            <TouchableOpacity
              onPress={() => router.replace(`/watch/${id}/${episode + 1}`)}
            >
              <Box row gap="md">
                <Box style={{ alignItems: "flex-end" }}>
                  <Text variant="label" color="white">
                    Next Episode
                  </Text>
                  <Text variant="small" color="faded">
                    Ep.{nextEpisode.number}
                  </Text>
                </Box>
                <Image
                  source={{ uri: nextEpisode.thumbnail }}
                  style={styles.thumbnail}
                />
              </Box>
            </TouchableOpacity>
          )}
        </Box>
      </Box>
    </View>
  );
};

interface ButtonProps extends TouchableHighlightProps {
  children: ReactNode | ReactNode[];
  padding?: number;
}

const Button = ({ children, padding, ...props }: ButtonProps) => (
  <TouchableHighlight
    style={{ borderRadius: 100 }}
    underlayColor="rgba(255,255,255,0.07)"
    activeOpacity={1}
    hitSlop={16}
    {...props}
  >
    <Box style={[styles.button, { padding }]}>{children}</Box>
  </TouchableHighlight>
);

const useControls = (
  status: AVPlaybackStatus | undefined,
  video: React.RefObject<Video>
) => ({
  backward: (intro = false) => {
    if (!status?.isLoaded) return;
    if (status.positionMillis < 10000) {
      video.current?.setPositionAsync(0);
      return;
    }

    video.current?.setPositionAsync(
      status.positionMillis - (intro ? 90000 : 10000)
    );
  },
  togglePlayback: () => {
    if (!status?.isLoaded) return;

    if (status.isPlaying) video.current?.pauseAsync();
    else video.current?.playAsync();
  },
  forward: (intro: boolean = false) => {
    if (!status?.isLoaded) return;
    video.current?.setPositionAsync(
      status.positionMillis + (intro ? 87000 : 10000)
    );
  },
});

export default PlayerControls;

const styles = StyleSheet.create({
  progressContainer: {
    height: 2,
    backgroundColor: chroma("#fff").alpha(0.25).css(),
  },
  container: {
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "stretch",
    justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
  },
  footer: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  controls: {
    alignItems: "center",
    justifyContent: "center",
    gap: 64,
  },
  button: {
    backgroundColor: "rgba(0,0,0,0.33)",
    borderRadius: 100,
  },
  thumbnail: {
    height: theme.spacing["2xl"],
    aspectRatio: 16 / 9,
    borderRadius: theme.spacing.xs,
    borderWidth: 1,
    borderColor: "white",
  },
});