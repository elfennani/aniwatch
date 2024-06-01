import { DimensionValue, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { AVPlaybackStatusSuccess } from "expo-av";
import chroma from "chroma-js";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";

type Props = {
  onProgress: (progressMillis: number) => void;
  onTouch: (isTouching: boolean) => void;
  position: number;
  duration?: number;
};

const PlayerProgress = ({ position, duration, onProgress, onTouch }: Props) => {
  const [width, setWidth] = useState<number>();
  const left = useSharedValue(0);
  const visible = useSharedValue(0);

  const derivedStyle = useAnimatedStyle(
    () => ({
      left: `${left.value}%`,
      transform: [{ scale: visible.value }],
    }),
    [left, visible]
  );

  const progressPercent = duration ? (position / duration) * 100 : 0;

  const progress: DimensionValue = `${progressPercent}%`;

  const update = (percentage: number) => {
    if (!duration) return;
    onProgress(duration * (percentage / 100));
  };

  const gesture = Gesture.Pan()
    .hitSlop(16)
    .onBegin((e) => {
      if (!width) return;
      const percentage = Math.max(0, Math.min(100, (e.x / width) * 100));
      left.value = percentage;

      visible.value = withTiming(1, { duration: 100 });
      runOnJS(onTouch)(true);
    })
    .onUpdate((e) => {
      if (width) {
        const percentage = Math.max(0, Math.min(100, (e.x / width) * 100));
        left.value = percentage;
      }
    })
    .onFinalize((e) => {
      visible.value = withTiming(0, { duration: 100 });
      if (!width) return;
      const percentage = Math.max(0, Math.min(100, (e.x / width) * 100));
      runOnJS(update)(percentage);
      runOnJS(onTouch)(false);
    });

  return (
    <View
      className="relative justify-center flex-1"
      onLayout={(e) => {
        if (width == undefined) setWidth(e.nativeEvent.layout.width);
      }}
    >
      <GestureDetector gesture={gesture}>
        <View className="rounded-full h-[2] justify-center bg-[rgba(255,255,255,0.25)]">
          <View
            hitSlop={16}
            style={{ width: progress }}
            className="bg-white rounded-full h-[2] absolute top-0 left-0"
          />
          <Animated.View
            className="rounded-full size-2 bg-white absolute -ml-1"
            style={derivedStyle}
          />
        </View>
      </GestureDetector>
    </View>
  );
};

export default PlayerProgress;

const styles = StyleSheet.create({
  load: {
    height: 2,
    backgroundColor: chroma("#fff").alpha(0.25).css(),
  },
});
