import {
  View,
  TouchableOpacity,
  TouchableHighlight,
  useColorScheme,
} from "react-native";
import React, { memo } from "react";
import { Iconify } from "react-native-iconify";
import { purple } from "tailwindcss/colors";
import chroma from "chroma-js";
import Text from "./text";

type Props = {
  onWatch: () => void;
  onSetStatus: () => void;
};

const MediaActions = memo(({ onSetStatus, onWatch }: Props) => {
  const scheme = useColorScheme();

  return (
    <View className="px-6 flex-row gap-2">
      <TouchableOpacity
        hitSlop={8}
        activeOpacity={0.8}
        onPress={() => onWatch()}
        className="bg-purple-500 dark:bg-purple-700 flex-row gap-2 flex-1 items-center justify-center rounded-md py-3"
      >
        <Iconify
          icon="material-symbols-light:play-arrow"
          size={24}
          color={purple[100]}
        />
        <Text className="font-medium text-sm text-purple-100">Watch Now</Text>
      </TouchableOpacity>
      <TouchableHighlight
        hitSlop={8}
        activeOpacity={0.8}
        className="flex-row gap-2 flex-1 items-center justify-center rounded-md py-3"
        underlayColor={chroma(scheme == "dark" ? "white" : "black")
          .alpha(0.12)
          .css()}
        onPress={() => onSetStatus()}
      >
        <>
          <Iconify
            icon="material-symbols-light:add"
            size={24}
            color={scheme == "dark" ? "white" : "black"}
          />
          <Text className="font-medium text-sm">Add Status</Text>
        </>
      </TouchableHighlight>
    </View>
  );
});

export default MediaActions;
