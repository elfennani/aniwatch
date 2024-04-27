import {
  ActivityIndicator,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { AVPlaybackStatus, ResizeMode, Video } from "expo-av";
import React, { useEffect, useRef, useState } from "react";
import useLinkQuery from "@/api/use-link-query";
import AntDesign from "@expo/vector-icons/AntDesign";
import { LinearGradient } from "expo-linear-gradient";
import Text from "./text";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import secondsToHms from "@/utils/seconds-to-hms";
import useWatchedMutation from "@/api/use-watched-mutation";

type Props = {
  aniListId: number;
  allAnimeId: string;
  episode: number;
  dubbed: boolean;
  watched: boolean;
};

const PlayerLoader = ({
  allAnimeId,
  episode,
  dubbed,
  watched,
  aniListId,
}: Props) => {
  const [controls, setControls] = useState(false);
  const [status, setStatus] = useState<AVPlaybackStatus | null>(null);
  const position = useSharedValue(0);
  const { height, width } = useWindowDimensions();
  const style = useAnimatedStyle(() => ({ top: position.value }));
  const video = useRef<Video>(null);
  const isFirstPress = useRef(false);
  const updatedEntry = useRef(false);
  const doubleTouchTimeout = useRef<NodeJS.Timeout | null>(null);
  const {
    mutate,
    isPending: isWatchedMutationPending,
    isSuccess,
  } = useWatchedMutation(
    { episode, showId: aniListId },
    () => updatedEntry.current == true
  );
  const { data, isPending, isError } = useLinkQuery({
    episode: episode.toString(),
    allAnimeId,
    type: "sub",
  });

  useEffect(() => {
    if (
      !status?.isLoaded ||
      !status.durationMillis ||
      isWatchedMutationPending ||
      isSuccess
    )
      return;
    const progress = status.positionMillis;
    const duration = status.durationMillis;

    if (progress / duration > 0.8 && !watched && !updatedEntry.current) {
      mutate();
    }
  }, [status, updatedEntry, watched, isSuccess, isWatchedMutationPending]);

  function handleBackward(intro = false) {
    if (status?.isLoaded) {
      if (status.positionMillis < 10000) {
        video.current?.setPositionAsync(0);
        return;
      }

      video.current?.setPositionAsync(
        status.positionMillis - (intro ? 90000 : 10000)
      );
    }
  }

  function handleTogglePlayback() {
    if (status?.isLoaded) {
      if (status.isPlaying) video.current?.pauseAsync();
      else video.current?.playAsync();
    }
  }

  function handleForward(intro: boolean = false) {
    if (status?.isLoaded) {
      video.current?.setPositionAsync(
        status.positionMillis + (intro ? 88000 : 10000)
      );
    }
  }

  let playbackStatus = "play";

  if (status?.isLoaded) {
    if (status.isPlaying) {
      playbackStatus = "pause";
    } else if (status.isBuffering) {
      playbackStatus = "loading";
    } else {
      playbackStatus = "play";
    }
  }

  function handleTouchStart(e: GestureResponderEvent) {}

  function handleTouchMove(e: GestureResponderEvent) {}

  function handleTouchEnd(e: GestureResponderEvent) {}

  function handlePress({ nativeEvent: { locationX } }: GestureResponderEvent) {
    if (isFirstPress.current) {
      if (locationX < width / 3) {
        handleBackward();
      } else if (locationX > (2 * width) / 3) {
        handleForward();
      } else {
        handleTogglePlayback();
      }

      clearTimeout(doubleTouchTimeout.current!);
      doubleTouchTimeout.current = null;
      isFirstPress.current = false;
      return;
    }

    isFirstPress.current = true;
    doubleTouchTimeout.current = setTimeout(() => {
      isFirstPress.current = false;
      doubleTouchTimeout.current = null;
      position.value = withTiming(position.value == 0 ? height / 2 : 0, {
        duration: 100,
      });
    }, 200);
  }

  const auto = data?.find((level) => level.name == "auto")?.url;

  return (
    <Pressable
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onPress={handlePress}
    >
      <View style={{ position: "relative", backgroundColor: "black" }}>
        {auto && (
          <Video
            ref={video}
            source={{ uri: auto }}
            style={{ width: "100%", height: "100%" }}
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay={true}
            onPlaybackStatusUpdate={setStatus}
          />
        )}
        <View style={styles.controlsContainer}>
          <Animated.View style={[style]}>
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.7)"]}
              locations={[0.5, 1]}
              style={{
                width: "100%",
                height: "100%",
                justifyContent: "flex-end",
              }}
            >
              <View style={styles.controls}>
                {status?.isLoaded && (
                  <View>
                    <Text>
                      {secondsToHms(status.positionMillis / 1000)}
                      {!!status.durationMillis &&
                        ` / ${secondsToHms(status.durationMillis / 1000)}`}
                    </Text>
                  </View>
                )}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 40,
                  }}
                >
                  <TouchableOpacity
                    hitSlop={16}
                    activeOpacity={0.8}
                    onPress={() => handleBackward()}
                    onLongPress={() => handleBackward(true)}
                  >
                    <AntDesign
                      name="banckward"
                      color="rgba(255,255,255,0.9)"
                      size={24}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    hitSlop={16}
                    activeOpacity={0.8}
                    onPress={handleTogglePlayback}
                  >
                    {playbackStatus == "loading" ? (
                      <ActivityIndicator
                        size={40}
                        color="rgba(255,255,255,0.9)"
                      />
                    ) : (
                      <AntDesign
                        name={playbackStatus as any}
                        color="rgba(255,255,255,0.9)"
                        size={40}
                      />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    hitSlop={16}
                    activeOpacity={0.8}
                    onPress={() => handleForward()}
                    onLongPress={() => handleForward(true)}
                  >
                    <AntDesign
                      name="forward"
                      color="rgba(255,255,255,0.9)"
                      size={24}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>
        </View>
      </View>
    </Pressable>
  );
};

export default PlayerLoader;

const styles = StyleSheet.create({
  controlsContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  controls: {
    alignItems: "center",
    gap: 32,
    justifyContent: "flex-end",
    padding: 32,
  },
});
