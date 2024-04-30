import { Button, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Text from "./text";

type Props = {
  visible: boolean;
  onRequestClose: () => void;
  resolutions?: string[];
  current?: string;
  onSelect: (name: string) => void;
};

const QualitySelector = ({
  visible,
  onRequestClose,
  resolutions,
  onSelect,
  current,
}: Props) => {
  const opacity = useSharedValue(0);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    display: opacity.value ? "flex" : "none",
  }));

  useEffect(() => {
    opacity.value = withTiming(visible ? 1 : 0, { duration: 150 });
  }, [visible]);

  const hasCurrent = resolutions?.includes(current!);

  return (
    <TouchableOpacity
      disabled={!visible}
      onPress={onRequestClose}
      style={[styles.container, !visible && { zIndex: -10 }]}
    >
      <Animated.View style={[style, styles.innerContainer]}>
        {resolutions?.map((res) => {
          const active =
            current == res || (res == "auto" && !hasCurrent) ? 24 : 0;
          return (
            <TouchableOpacity onPress={() => onSelect(res)} hitSlop={16}>
              <Text
                style={{
                  textShadowColor: "white",
                  fontSize: 32,
                  textShadowRadius: active,
                  opacity: active ? 1 : 0.8,
                  textTransform: "capitalize",
                }}
              >
                {res}
              </Text>
            </TouchableOpacity>
          );
        })}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default QualitySelector;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  innerContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
});
