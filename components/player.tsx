import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import React, { useRef, useState } from "react";
import { AVPlaybackStatus, ResizeMode, Video } from "expo-av";
import PlayerControls from "./player-controls";

type Props = {
  url: string;
};

const Player = ({ url }: Props) => {
  const ref = useRef<Video>(null);
  const [status, setStatus] = useState<AVPlaybackStatus>();
  const [controls, setControls] = useState(false);
  const handler = usePressHandler(ref, status, () => setControls((c) => !c));

  return (
    <Pressable onPress={handler}>
      <View style={styles.container}>
        <Video
          ref={ref}
          style={{ width: "100%", height: "100%" }}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay
          onPlaybackStatusUpdate={setStatus}
          source={{ uri: url }}
        />
      </View>
      <PlayerControls status={status} videoRef={ref} visible={controls} />
    </Pressable>
  );
};

const usePressHandler = (
  video: React.RefObject<Video>,
  status: AVPlaybackStatus | undefined,
  onToggle?: () => void
) => {
  const isFirstPress = useRef(false);
  const doublePressTimeout = useRef<NodeJS.Timeout | null>(null);
  const { width } = useWindowDimensions();

  function handlePress({ nativeEvent: { locationX } }: GestureResponderEvent) {
    if (!status?.isLoaded) return;

    if (isFirstPress.current) {
      if (locationX < width / 3) {
        video.current?.setPositionAsync(status.positionMillis - 5000);
      } else if (locationX > (2 * width) / 3) {
        video.current?.setPositionAsync(status.positionMillis + 15000);
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
      onToggle?.();
    }, 200);
  }

  return handlePress;
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
