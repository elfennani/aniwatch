import { StyleSheet, View, useWindowDimensions } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import PlayerControls from "./player-controls";
import {
  BACKWARD_DURATION,
  CONTROLS_TIMEOUT,
  FORWARD_DURATION,
} from "@/constants/values";
import { storage } from "@/utils/mmkv";
import * as keys from "@/constants/keys";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Options from "./options";
import { Iconify } from "react-native-iconify";
import { trueGray, zinc } from "tailwindcss/colors";
import { usePlayerData } from "@/ctx/player-data";
import { useMMKVString } from "react-native-mmkv";
import { useVideoPlayer, VideoView } from "expo-video";

type Props = {
  url: string;
  onOverThreshold?: () => void;
  /** percentage between 0 and 1 */
  threshold?: number;
};

type TO = NodeJS.Timeout | null;

const Player = ({ url, threshold, onOverThreshold }: Props) => {
  const initialUrl = useRef(url);
  const [settings, setSettings] = useState(false);
  const [qualityOverlay, setQualityOverlay] = useState(false);
  const [isTouchingControls, setIsTouchingControls] = useState(false);
  const [quality, setQuality] = useMMKVString(keys.qualityKey);
  const [translation, setTranslation] = useMMKVString(keys.translationKey);
  const { width } = useWindowDimensions();
  const { qualities, dubbed, title, episode } = usePlayerData();
  const [positionSeconds, setPositionSeconds] = useState(0);
  const positionRef = useRef(positionSeconds);
  const [durationSeconds, setDurationSeconds] = useState<number>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [controls, setControls] = useControlsStatus(
    isPlaying,
    isTouchingControls
  );
  const player = useVideoPlayer(
    {
      uri: initialUrl.current,
      metadata: { title: `Episode ${episode}`, artist: title },
    },
    (player) => {
      player.play();
      player.showNowPlayingNotification = true;
    }
  );

  useEffect(() => {
    if (!durationSeconds) return;
    if (positionSeconds / durationSeconds > (threshold ?? 0.8)) {
      onOverThreshold?.();
    }
  }, [positionSeconds, durationSeconds]);

  useEffect(() => {
    player.replace({
      uri: url,
      metadata: { title: `Episode ${episode}`, artist: title },
    });

    return () => {};
  }, [url]);

  useEffect(() => {
    const unsubStatus = player.addListener("statusChange", (status) => {
      console.log(status);
      if (status == "readyToPlay" || status == "idle") {
        setDurationSeconds(player.duration);
      }
    });

    const unsubSource = player.addListener("sourceChange", (source) => {
      console.log(positionRef.current);
      player.currentTime = positionRef.current;
    });

    const unsubPlayback = player.addListener("playingChange", (isPlaying) =>
      setIsPlaying(isPlaying)
    );

    return () => {
      unsubPlayback.remove();
      unsubSource.remove();
      unsubStatus.remove();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPositionSeconds(player.currentTime);
      positionRef.current = player.currentTime;
    }, 500);

    return () => clearInterval(interval);
  }, [player]);

  const tapGesture = Gesture.Tap()
    .runOnJS(true)
    .maxDelay(150)
    .numberOfTaps(1)
    .onEnd((e) => {
      setControls((c) => !c);
    });

  const doubleTapGesture = Gesture.Tap()
    .maxDelay(150)
    .numberOfTaps(2)
    .runOnJS(true)
    .onEnd(({ x }) => {
      if (x < width / 3) {
        player.seekBy(-BACKWARD_DURATION / 1000);
      } else if (x > (2 * width) / 3) {
        player.seekBy(FORWARD_DURATION / 1000);
      } else {
        if (player.playing) player.pause();
        else player.play();
      }
    });

  const gesture = Gesture.Exclusive(doubleTapGesture, tapGesture);

  const hdIcon = (
    <Iconify
      icon="material-symbols-light:high-quality-outline-sharp"
      size={24}
      color={zinc[300]}
    />
  );

  const sdIcon = (
    <Iconify
      icon="material-symbols-light:sd-outline-sharp"
      size={24}
      color={zinc[300]}
    />
  );

  const voiceIcon = (
    <Iconify
      icon="material-symbols-light:record-voice-over-outline"
      size={24}
      color={zinc[300]}
    />
  );

  return (
    <>
      <Options visible={settings} onClose={() => setSettings(false)}>
        {qualities && !!qualities.length && (
          <Options.Option
            icon={hdIcon}
            title="Change Quality"
            subtitle={quality ?? "auto"}
            onPress={() => setQualityOverlay(true)}
            more
          />
        )}
        {dubbed && (
          <Options.Option
            icon={voiceIcon}
            title="Switch Language"
            subtitle={translation == "dub" ? "DUB" : "SUB"}
            onPress={() =>
              setTranslation((translation ?? "sub") == "dub" ? "sub" : "dub")
            }
          />
        )}
      </Options>
      <Options
        visible={qualityOverlay}
        onClose={() => setQualityOverlay(false)}
      >
        {qualities?.map((q) => (
          <Options.Option
            key={q}
            disabled={(quality ?? "auto") == q}
            icon={hdIcon}
            title={q}
            onPress={() => setQuality(q)}
          />
        ))}
      </Options>
      <GestureDetector gesture={gesture}>
        <View style={{ flex: 1 }}>
          <View style={styles.container}>
            <VideoView
              style={{ width: "100%", height: "100%" }}
              contentFit="contain"
              player={player}
              nativeControls={false}
            />
          </View>
          <PlayerControls
            player={player}
            isPlaying={isPlaying}
            position={positionSeconds}
            duration={durationSeconds}
            visible={controls}
            onTouch={setIsTouchingControls}
            onSettings={() => setSettings(true)}
          />
        </View>
      </GestureDetector>
    </>
  );
};

// const useStatus = (url: string) => {
//   const [initialStatus, setInitialStatus] = useState<AVPlaybackStatus>();
//   const [status, setStatus] = useState<AVPlaybackStatus>();

//   useEffect(() => {
//     const listener = storage.addOnValueChangedListener((key) => {
//       if ([keys.qualityKey, keys.translationKey].includes(key)) {
//         setInitialStatus(status);
//       }
//     });

//     return () => listener.remove();
//   }, [status]);

//   return [status, setStatus, initialStatus] as const;
// };

const useControlsStatus = (isPlaying: boolean, disableTimeout = false) => {
  const [controls, setControls] = useState(false);
  const timeoutControls = useRef<TO>(null);

  useEffect(() => {
    if (isPlaying && controls && !timeoutControls.current) {
      timeoutControls.current = setTimeout(() => {
        setControls(false);
        timeoutControls.current = null;
      }, CONTROLS_TIMEOUT);
    }

    if (
      (!isPlaying || disableTimeout || !controls) &&
      !!timeoutControls.current
    ) {
      clearTimeout(timeoutControls.current);
      timeoutControls.current = null;
    }
  }, [isPlaying, controls, disableTimeout]);

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
