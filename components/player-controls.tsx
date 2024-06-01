import { StyleSheet, TouchableWithoutFeedback } from "react-native";
import React, { useState } from "react";
import { AVPlaybackStatus, Video } from "expo-av";
import Text from "./text";
import { Iconify } from "react-native-iconify";
import secondsToHms from "@/utils/seconds-to-hms";
import useControls from "@/hooks/use-controls";
import PlayerProgress from "./player-progress";
import { View } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  FadeOutDown,
} from "react-native-reanimated";
import {
  TapGestureHandler,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { router } from "expo-router";
import { Portal } from "@gorhom/portal";
import { zinc } from "tailwindcss/colors";
import Options from "./options";
import { VideoPlayer } from "expo-video";
import { duration } from "moment";

type Props = {
  visible: boolean;
  player: VideoPlayer;
  duration?: number;
  position: number;
  isPlaying: boolean;
  onTouch: (isTouching: boolean) => void;
  onSettings?: () => void;
};

const PlayerControls = ({
  player,
  visible,
  onTouch,
  onSettings,
  isPlaying,
  duration,
  position,
}: Props) => {
  const { togglePlayback } = useControls(player);

  const playbackIcon = isPlaying ? (
    <Iconify
      icon="material-symbols-light:pause-outline"
      size={32}
      color="white"
    />
  ) : (
    <Iconify
      icon="material-symbols-light:play-arrow-outline"
      size={40}
      color="white"
    />
  );

  const durationString = duration && secondsToHms(duration);
  const positionString = secondsToHms(position);

  if (!visible) return;

  return (
    <View style={StyleSheet.absoluteFill} className="items-center">
      <Animated.View
        entering={FadeIn.duration(300)}
        exiting={FadeOut.duration(300)}
        className="absolute top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.33)]"
      />
      <Animated.View
        entering={FadeInDown.duration(250)}
        exiting={FadeOutDown.duration(250)}
        className="absolute top-0 bottom-0 items-stretch justify-end py-8 pr-10 pl-6 aspect-video"
      >
        <View className="flex-row w-full items-center">
          <TapGestureHandler>
            <TouchableOpacity
              disallowInterruption
              activeOpacity={0.8}
              onPress={() => togglePlayback()}
            >
              <View className="w-12 h-12 items-center justify-center">
                {playbackIcon}
              </View>
            </TouchableOpacity>
          </TapGestureHandler>
          <View className="flex-row flex-1 gap-3 items-center">
            <Text
              className="!text-white text-sm font-semibold text-right"
              style={{ width: 50 }}
              adjustsFontSizeToFit
            >
              {positionString}
            </Text>
            <PlayerProgress
              onTouch={onTouch}
              position={position}
              duration={duration}
              onProgress={(pos) => (player.currentTime = pos)}
            />
            <Text className="!text-white text-sm font-semibold">
              {durationString}
            </Text>
          </View>
          <TapGestureHandler>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onSettings?.()}
            >
              <View className="w-12 h-12 items-center justify-center pl-6">
                <Iconify
                  icon="material-symbols-light:settings-outline-rounded"
                  size={24}
                  color="white"
                />
              </View>
            </TouchableOpacity>
          </TapGestureHandler>
        </View>
      </Animated.View>
    </View>
  );
};

export default PlayerControls;
