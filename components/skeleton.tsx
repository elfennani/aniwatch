import { DimensionValue, StyleSheet, ViewProps } from "react-native";
import React, { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "@/ctx/theme-provider";

type Props = {
  width?: DimensionValue;
  height?: DimensionValue;
  radius?: number;
} & ViewProps;

const Skeleton = ({ height, width, radius = 6, ...props }: Props) => {
  const sv = useSharedValue(0);
  const opacity = useDerivedValue(() => sv.value / 2 + 0.5);
  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
  const theme = useTheme();

  useEffect(() => {
    sv.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
  }, []);

  return (
    <Animated.View
      {...props}
      style={[
        style,
        {
          width,
          height,
          backgroundColor: theme.colors.loading,
          borderRadius: radius,
        },
        props.style,
      ]}
    />
  );
};

export default Skeleton;

const styles = StyleSheet.create({});
