import {
  View,
  TouchableOpacity,
  TouchableHighlight,
  useColorScheme,
  Platform,
} from "react-native";
import React, { memo } from "react";
import { Iconify } from "react-native-iconify";
import { purple } from "tailwindcss/colors";
import chroma from "chroma-js";
import Text from "./text";
import StatusIcon from "./status-icon";
import MediaStatus from "@/interfaces/MediaStatus";
import statusToString from "@/utils/status-to-string";

type Props = {
  status?: MediaStatus;
  onWatch: () => void;
  onSetStatus: () => void;
};

const MediaActions = memo(({ onSetStatus, onWatch, status }: Props) => {
  const scheme = useColorScheme();

  let iconColor = scheme == "dark" ? "white" : "black";

  if (Platform.OS == "web") {
    iconColor = purple[500];
  }

  return (
    <View className="native:px-6 native:flex-row web:flex-col gap-2">
      <TouchableOpacity
        hitSlop={8}
        activeOpacity={0.8}
        onPress={() => onWatch()}
        className="bg-purple-500 dark:bg-purple-700 flex-row gap-2 flex-1 items-center justify-center rounded-md native:py-3 web:py-2"
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
        className="flex-row gap-2 flex-1 items-center justify-center rounded-md native:py-3 web:py-2 web:border web:border-purple-500"
        underlayColor={chroma(scheme == "dark" ? "white" : "black")
          .alpha(0.12)
          .css()}
        onPress={() => onSetStatus()}
      >
        <>
          {status ? (
            <StatusIcon status={status} size={24} color={iconColor} />
          ) : (
            <Iconify
              icon="material-symbols-light:add"
              size={24}
              color={iconColor}
            />
          )}
          <Text className="font-medium text-sm capitalize web:text-purple-500">
            {status ? statusToString(status) : "Add Status"}
          </Text>
        </>
      </TouchableHighlight>
    </View>
  );
});

export default MediaActions;
