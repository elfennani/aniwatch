import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { AVPlaybackStatus, ResizeMode, Video } from "expo-av";
import React, { useRef, useState } from "react";
import useLinkQuery from "@/api/use-link-query";
import AntDesign from "@expo/vector-icons/AntDesign";
import { LinearGradient } from "expo-linear-gradient";
import Text from "./text";
import secondsToHms from "@/utils/seconds-to-hms";

type Props = {
  allAnimeId: string;
  episode: number;
  dubbed: boolean;
};

const PlayerLoader = ({ allAnimeId, episode, dubbed }: Props) => {
  const [controls, setControls] = useState(false);
  const [status, setStatus] = useState<AVPlaybackStatus | null>(null);
  const video = useRef<Video>(null);
  const { height, width } = useWindowDimensions();
  const { data, isPending, isError } = useLinkQuery({
    episode: episode.toString(),
    allAnimeId,
    type: "sub",
  });

  function handleBackward() {
    if (status?.isLoaded) {
      if (status.positionMillis < 10000) {
        video.current?.setPositionAsync(0);
        return;
      }

      video.current?.setPositionAsync(status.positionMillis - 10000);
    }
  }

  function handleTogglePlayback() {
    if (status?.isLoaded) {
      if (status.isPlaying) video.current?.pauseAsync();
      else video.current?.playAsync();
    }
  }

  function handleForward() {
    if (status?.isLoaded) {
      video.current?.setPositionAsync(status.positionMillis + 10000);
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

  const auto = data?.find((level) => level.name == "auto")?.url;

  return (
    <Pressable
      onPress={() => setControls((c) => !c)}
      style={{ position: "relative", backgroundColor: "black" }}
    >
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

      {controls && (
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)"]}
          locations={[0.5, 1]}
          style={styles.controlsContainer}
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
                onPress={handleBackward}
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
                  <ActivityIndicator size={40} color="rgba(255,255,255,0.9)" />
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
                onPress={handleForward}
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
      )}
    </Pressable>
  );
};

export default PlayerLoader;

const styles = StyleSheet.create({
  controlsContainer: {
    position: "absolute",
    top: 0,
    right: 0,
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
