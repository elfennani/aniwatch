import { StyleSheet, View, useWindowDimensions } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { AVPlaybackStatus, ResizeMode, Video } from "expo-av";
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
import { zinc } from "tailwindcss/colors";
import { usePlayerData } from "@/ctx/player-data";
import { useMMKVString } from "react-native-mmkv";

type Props = {
  url: string;
  onOverThreshold?: () => void;
  /** percentage between 0 and 1 */
  threshold?: number;
};

type TO = NodeJS.Timeout | null;

const Player = ({ url, threshold, onOverThreshold }: Props) => {
  const video = useRef<Video>(null);
  const [status, setStatus, initial] = useStatus(url);
  const [settings, setSettings] = useState(false);
  const [qualityOverlay, setQualityOverlay] = useState(false);
  const [isTouchingControls, setIsTouchingControls] = useState(false);
  const [quality, setQuality] = useMMKVString(keys.qualityKey);
  const [translation, setTranslation] = useMMKVString(keys.translationKey);
  const [controls, setControls] = useControlsStatus(status, isTouchingControls);
  const { width } = useWindowDimensions();
  const { qualities, dubbed } = usePlayerData();

  useEffect(() => {
    if (!status?.isLoaded || !status.durationMillis) return;
    if (status.positionMillis / status.durationMillis > (threshold ?? 0.8)) {
      onOverThreshold?.();
    }
  }, [status]);

  const tapGesture = Gesture.Tap()
    .runOnJS(true)
    .maxDelay(150)
    .numberOfTaps(1)
    .onEnd((e) => {
      console.log("first");
      setControls((c) => !c);
    });

  const doubleTapGesture = Gesture.Tap()
    .maxDelay(150)
    .numberOfTaps(2)
    .runOnJS(true)
    .onEnd(({ x }) => {
      if (!status?.isLoaded) return;
      if (x < width / 3) {
        video.current?.setPositionAsync(
          status.positionMillis - BACKWARD_DURATION
        );
      } else if (x > (2 * width) / 3) {
        video.current?.setPositionAsync(
          status.positionMillis + FORWARD_DURATION
        );
      } else {
        if (status.isPlaying) video.current?.pauseAsync();
        else video.current?.playAsync();
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
        <Options.Option
          icon={hdIcon}
          title="Change Quality"
          subtitle={quality ?? "auto"}
          onPress={() => setQualityOverlay(true)}
          more
        />
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
            <Video
              ref={video}
              style={{ width: "100%", height: "100%" }}
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay
              onPlaybackStatusUpdate={setStatus}
              source={{ uri: url }}
              status={initial}
              progressUpdateIntervalMillis={300}
            />
          </View>
          <PlayerControls
            status={status}
            videoRef={video}
            visible={controls}
            onTouch={setIsTouchingControls}
            onSettings={() => setSettings(true)}
          />
        </View>
      </GestureDetector>
    </>
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
