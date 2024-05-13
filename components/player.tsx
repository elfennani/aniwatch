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
  FORWARD_DURATION,
  TOUCH_CANCEL_DISTANCE,
} from "@/constants/values";

type Props = {
  url: string;
};

type TO = NodeJS.Timeout | null;

const Player = ({ url }: Props) => {
  const video = useRef<Video>(null);
  const isFirstPress = useRef(false);
  const doublePressTimeout = useRef<TO>(null);
  const initialPress = useRef({ x: 0, y: 0 });
  const canceled = useRef(false);
  const [status, setStatus] = useState<AVPlaybackStatus>();
  const [controls, setControls] = useControls(status);
  const { width } = useWindowDimensions();

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
    }, 200);
  }

  function handleTouchStart(e: GestureResponderEvent) {
    initialPress.current = { x: e.nativeEvent.pageX, y: e.nativeEvent.pageY };
  }

  function handleTouchMove(e: GestureResponderEvent) {
    const { x: x1, y: y1 } = initialPress.current;
    const { pageX: x2, pageY: y2 } = e.nativeEvent;
    const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

    if (distance > TOUCH_CANCEL_DISTANCE) {
      canceled.current = true;
    }
  }

  return (
    <Pressable
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
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
        />
      </View>
      <PlayerControls status={status} videoRef={video} visible={controls} />
    </Pressable>
  );
};

const useControls = (status: AVPlaybackStatus | undefined) => {
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

    if (!status.isPlaying && !!timeoutControls.current) {
      clearTimeout(timeoutControls.current);
      timeoutControls.current = null;
    }
  }, [status, controls]);

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
