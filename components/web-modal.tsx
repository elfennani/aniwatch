import { View, Text, Platform } from "react-native";
import React, { ReactNode } from "react";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  FadeOutDown,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

type Props = {
  visible: boolean;
  onClose(): void;
  children: ReactNode | ReactNode[];
};

const WebModal = ({ children, onClose, visible }: Props) => {
  if (Platform.OS !== "web") throw new Error("This modal is for web only");

  const gesture = Gesture.Tap().onFinalize(() => onClose());

  if (!visible) return null;

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      className="fixed top-0 left-0 right-0 bottom-0 z-30 flex items-center justify-center p-8"
    >
      <GestureDetector gesture={gesture}>
        <Animated.View className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-20" />
      </GestureDetector>
      <Animated.View
        entering={FadeInDown.duration(150)}
        exiting={FadeOutDown.duration(150)}
        className="p-8 bg-white rounded-md w-[500px] max-w-full max-h-full overflow-y-scroll"
      >
        {children}
      </Animated.View>
    </Animated.View>
  );
};

export default WebModal;
