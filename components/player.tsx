import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { AVPlaybackStatus, ResizeMode, Video } from "expo-av";
import PlayerControls from "./player-controls";
import {
  BACKWARD_DURATION,
  CONTROLS_TIMEOUT,
  DOUBLE_PRESS_DELAY,
  FORWARD_DURATION,
  TOUCH_CANCEL_DISTANCE,
} from "@/constants/values";
import { storage } from "@/utils/mmkv";
import * as keys from "@/constants/keys";
import Stats from "./stats";

type Props = {
  url: string;
  onOverThreshold?: () => void;
  /** percentage between 0 and 1 */
  threshold?: number;
};

type TO = NodeJS.Timeout | null;

const Player = ({ url, threshold, onOverThreshold }: Props) => {
  const video = useRef<Video>(null);
  const isFirstPress = useRef(false);
  const doublePressTimeout = useRef<TO>(null);
  const initialPress = useRef({ x: 0, y: 0 });
  const canceled = useRef(false);
  const [status, setStatus, initial] = useStatus(url);
  const [isTouchingControls, setIsTouchingControls] = useState(false);
  const [controls, setControls] = useControlsStatus(status, isTouchingControls);
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (!status?.isLoaded || !status.durationMillis) return;
    if (status.positionMillis / status.durationMillis > (threshold ?? 0.8)) {
      onOverThreshold?.();
    }
  }, [status]);

  function handler({
    nativeEvent: { locationX, ...ev },
  }: GestureResponderEvent) {
    if (canceled.current) {
      canceled.current = false;
      return;
    }
    if (!status?.isLoaded) return;

    if (isFirstPress.current) {
      if (locationX < width / 3) {
        video.current?.setPositionAsync(
          status.positionMillis - BACKWARD_DURATION
        );
      } else if (locationX > (2 * width) / 3) {
        video.current?.setPositionAsync(
          status.positionMillis + FORWARD_DURATION
        );
      } else {
        if (status.isPlaying) video.current?.pauseAsync();
        else video.current?.playAsync();
      }

      clearTimeout(doublePressTimeout.current!);
      doublePressTimeout.current = null;
      isFirstPress.current = false;
      return;
    }

    isFirstPress.current = true;
    doublePressTimeout.current = setTimeout(() => {
      isFirstPress.current = false;
      doublePressTimeout.current = null;
      setControls((c) => !c);
    }, DOUBLE_PRESS_DELAY);
  }

  function handleTouchStart(e: GestureResponderEvent) {
    initialPress.current = { x: e.nativeEvent.pageX, y: e.nativeEvent.pageY };
  }

  function handleTouchMove(e: GestureResponderEvent) {
    const { x: x1, y: y1 } = initialPress.current;
    const { pageX: x2, pageY: y2 } = e.nativeEvent;
    const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

    if (distance > TOUCH_CANCEL_DISTANCE) {
      setIsTouchingControls(true);
      canceled.current = true;
    }
  }

  return (
    <Pressable
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => setIsTouchingControls(false)}
      onPress={handler}
    >
      <View style={styles.container}>
        <Video
          ref={video}
          style={{ width: "100%", height: "100%" }}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay
          onPlaybackStatusUpdate={setStatus}
          source={{ uri: url }}
          status={initial}
        />
      </View>
      <PlayerControls status={status} videoRef={video} visible={controls} />
    </Pressable>
  );
};

const useStatus = (url: string) => {
  const [initialStatus, setInitialStatus] = useState<AVPlaybackStatus>();
  const [status, setStatus] = useState<AVPlaybackStatus>();

  useEffect(() => {
    const listener = storage.addOnValueChangedListener((key) => {
      if ([keys.qualityKey, keys.translationKey].includes(key)) {
        setInitialStatus(status);
      }
    });

    return () => listener.remove();
  }, [status]);

  return [status, setStatus, initialStatus] as const;
};

const useControlsStatus = (
  status: AVPlaybackStatus | undefined,
  disableTimeout = false
) => {
  const [controls, setControls] = useState(false);
  const timeoutControls = useRef<TO>(null);

  useEffect(() => {
    if (!status?.isLoaded) return;

    if (status.isPlaying && controls && !timeoutControls.current) {
      timeoutControls.current = setTimeout(() => {
        setControls(false);
        timeoutControls.current = null;
      }, CONTROLS_TIMEOUT);
    }

    if (
      (!status.isPlaying || disableTimeout || !controls) &&
      !!timeoutControls.current
    ) {
      clearTimeout(timeoutControls.current);
      timeoutControls.current = null;
    }
  }, [status, controls, disableTimeout]);

  return [controls, setControls] as const;
};

export default Player;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    backgroundColor: "black",
    width: "100%",
    height: "100%",
  },
});
