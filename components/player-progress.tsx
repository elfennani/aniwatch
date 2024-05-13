import {
  DimensionValue,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import { AVPlaybackStatusSuccess } from "expo-av";
import Box from "./box";
import Text from "./text";
import secondsToHms from "@/utils/seconds-to-hms";
import { useTheme } from "@/ctx/theme-provider";
import chroma from "chroma-js";
import { TOUCH_CANCEL_DISTANCE } from "@/constants/values";

type Props = {
  status: AVPlaybackStatusSuccess;
  onProgress: (progressMillis: number) => void;
};

const PlayerProgress = ({ status, onProgress }: Props) => {
  const [bulletPosition, setBulletPosition] = useState<number>();
  const initialPosition = useRef(0);
  const initialPageX = useRef<number>();
  const shouldMove = useRef(false);
  const width = useRef<number>();
  const [bulletWidth, setBulletWidth] = useState<number>();
  const {
    colors: { primary: backgroundColor },
    spacing: { md },
  } = useTheme();

  const progressPercent = status.durationMillis
    ? (status.positionMillis / status.durationMillis) * 100
    : 0;

  const playablePercent =
    status.durationMillis && status.playableDurationMillis
      ? (status?.playableDurationMillis / status.durationMillis) * 100
      : 0;

  const progress: DimensionValue = `${progressPercent}%`;
  const playable: DimensionValue = `${playablePercent}%`;

  const minmax = (number: number) => Math.min(Math.max(number, 0), 1);

  type TouchEvent = (e: GestureResponderEvent) => void;

  const handleTouchStart: TouchEvent = ({ nativeEvent: { pageX } }) =>
    (initialPosition.current = pageX);

  const handleTouchMove: TouchEvent = ({ nativeEvent: { pageX } }) => {
    if (Math.abs(pageX - initialPosition.current) > TOUCH_CANCEL_DISTANCE) {
      shouldMove.current = true;
    }

    if (
      !initialPageX.current ||
      !width.current ||
      !shouldMove.current ||
      !bulletWidth
    )
      return;
    setBulletPosition(minmax((pageX - initialPageX.current) / width.current));
  };

  const handleTouchEnd: TouchEvent = ({ nativeEvent: { pageX } }) => {
    setTimeout(() => setBulletPosition(undefined), 200);
    shouldMove.current = false;

    if (!initialPageX.current || !width.current || !status.durationMillis)
      return;

    onProgress(
      ((pageX - initialPageX.current) / width.current) * status.durationMillis
    );
  };

  const handlePress: TouchEvent = ({ nativeEvent: { pageX } }) => {
    if (!initialPageX.current || !width.current || !status.durationMillis)
      return;

    onProgress(
      ((pageX - initialPageX.current) / width.current) * status.durationMillis
    );
  };

  return (
    <Box
      style={{ position: "relative", justifyContent: "center" }}
      onLayout={(e) => {
        width.current = e.nativeEvent.layout.width;
        initialPageX.current = e.nativeEvent.layout.x;
      }}
    >
      <Pressable onPress={handlePress} hitSlop={md}>
        <Box rounding="full" style={styles.progressContainer}>
          <Box
            hitSlop={16}
            style={[styles.progress, { backgroundColor, width: progress }]}
          />
          <Box style={[styles.load, { width: playable }]} />
        </Box>
      </Pressable>
      <Pressable
        style={{
          position: "absolute",
          marginLeft: -(bulletWidth ?? 0) / 2,
          left:
            bulletPosition != undefined ? `${bulletPosition * 100}%` : progress,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Box
          width="md"
          height="md"
          rounding="full"
          background="primary"
          onLayout={(e) => setBulletWidth(e.nativeEvent.layout.width)}
        />
      </Pressable>
    </Box>
  );
};

export default PlayerProgress;

const styles = StyleSheet.create({
  progressContainer: {
    height: 2,
    backgroundColor: chroma("#fff").alpha(0.25).css(),
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
