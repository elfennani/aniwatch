import { View, Text, useWindowDimensions, useColorScheme } from "react-native";
import React, { memo } from "react";
import RenderHTML from "react-native-render-html";
import { zinc } from "tailwindcss/colors";

type Props = {
  description: string | undefined;
};

const MediaSynopsis = memo(({ description }: Props) => {
  const { width } = useWindowDimensions();
  const scheme = useColorScheme();

  if (!description) return null;
  return (
    <View className="px-6">
      <RenderHTML
        contentWidth={width - 48}
        systemFonts={["regular"]}
        baseStyle={{
          fontFamily: "regular",
          color: scheme == "dark" ? zinc[400] : zinc[600],
          fontSize: 14,
          lineHeight: 22,
        }}
        source={{ html: description }}
      />
    </View>
  );
});

export default MediaSynopsis;
