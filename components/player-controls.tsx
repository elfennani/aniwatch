import {
  DimensionValue,
  StyleSheet,
  TouchableHighlight,
  TouchableHighlightProps,
  TouchableOpacity,
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
import Slider from "./slider";
import useVolume from "@/hooks/use-volume";
import useBrightness from "@/hooks/use-brightness";
import VisibilityView from "./visibility-view";
import useControls from "@/hooks/use-controls";
import { useMMKVString } from "react-native-mmkv";
import * as keys from "@/constants/keys";

type Props = {
  visible: boolean;
  videoRef: React.RefObject<Video>;
  status: AVPlaybackStatus | undefined;
};

const PlayerControls = ({ status, videoRef: video, visible }: Props) => {
  const { backward, forward, togglePlayback } = useControls(status, video);
  const [volume, setVolume] = useVolume();
  const [brightness, setBrightness] = useBrightness();
  const { title, episode, nextEpisode, id, qualities } = usePlayerData();
  const [quality, setQuality] = useMMKVString(keys.qualityKey, undefined);

  const {
    spacing,
    colors: { primary: backgroundColor },
  } = useTheme();
  const { top, bottom } = useSafeAreaInsets();

  if (!status?.isLoaded) return;

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

  const volumeIcon = (
    <Iconify
      icon="material-symbols-light:volume-down"
      size={24}
      color="white"
    />
  );

  const brightnessIcon = (
    <Iconify
      icon="material-symbols-light:brightness-7"
      size={18}
      color="white"
    />
  );

  const duration =
    status.durationMillis && secondsToHms(status.durationMillis / 1000);
  const position = secondsToHms(status.positionMillis / 1000);

  return (
    <VisibilityView
      visible={visible}
      style={[StyleSheet.absoluteFill, styles.container]}
    >
      {/* Header, contains information on the left, and brightness and volume controls on the right. */}
      <Box
        row
        style={[styles.header, { paddingTop: spacing.lg + top }]}
        paddingHorizontal="xl"
      >
        <Box row gap="md" style={{ alignItems: "center" }}>
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
        <Box row gap="4xl">
          <Slider value={volume} onChange={setVolume} icon={volumeIcon} />
          <Slider
            value={brightness}
            onChange={setBrightness}
            icon={brightnessIcon}
          />
        </Box>
      </Box>
      {/* Middle controls: backward, toggle playback, forward */}
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
              style={[styles.progress, { backgroundColor, width: progress }]}
            />
            <Box style={[styles.load, { width: playable }]} />
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
          <Box row gap="lg">
            {qualities?.map((q) => (
              <TouchableOpacity key={q} onPress={() => setQuality(q)}>
                <Box
                  background={q == quality ? "white" : undefined}
                  padding="xs"
                  style={{
                    borderColor: "white",
                    borderWidth: 1,
                    opacity: q == quality ? 1 : 0.66,
                  }}
                >
                  <Text
                    variant="small"
                    color={q == quality ? "black" : "white"}
                  >
                    {q == "auto" ? "AUTO" : q}
                  </Text>
                </Box>
              </TouchableOpacity>
            ))}
          </Box>
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
    </VisibilityView>
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
    justifyContent: "space-between",
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
  progress: {
    height: 2,
    position: "absolute",
    top: 0,
    left: 0,
  },
  load: {
    height: 2,
    backgroundColor: chroma("#fff").alpha(0.25).css(),
  },
});
