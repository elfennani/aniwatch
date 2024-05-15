import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import React, { ForwardedRef } from "react";
import { Episode } from "@/interfaces/Episode";
import secondsToHms from "@/utils/seconds-to-hms";
import Text from "./text";
import { Image } from "expo-image";
import { useTheme } from "@/ctx/theme-provider";
import { Iconify } from "react-native-iconify";

type Props = {
  mediaId: number;
  episode: Episode;
  watched?: boolean;
} & TouchableOpacityProps;

const EpsiodeItem = React.forwardRef(
  (
    {
      episode: { dub, id, number, thumbnail, duration, resolution },
      mediaId,
      watched = false,
      ...props
    }: Props,
    ref: ForwardedRef<TouchableOpacity>
  ) => {
    const {
      colors: { card, secondary },
    } = useTheme();

    return (
      <View style={watched && { opacity: 0.75 }}>
        <TouchableOpacity
          ref={ref}
          activeOpacity={0.8}
          {...props}
          style={[styles.container]}
        >
          {thumbnail ? (
            <Image
              cachePolicy="memory-disk"
              recyclingKey={id}
              source={{
                uri: thumbnail,
                width: 124,
                height: 124 * (9 / 16),
              }}
              contentFit="cover"
              style={[styles.image, { backgroundColor: card }]}
            />
          ) : (
            <View style={styles.image}>
              <Iconify
                icon="material-symbols-light:error-outline"
                color={secondary}
                size={24}
              />
            </View>
          )}
          <View>
            <Text>Episode {number}</Text>
            <Text
              style={{ textTransform: "uppercase", marginTop: 4 }}
              variant="label"
              color="secondary"
            >
              sub {dub && "• dub"}{" "}
              {watched && (
                <Text color="primary" variant="label">
                  • WATCHED
                </Text>
              )}
            </Text>
            <Text style={{ marginTop: 4 }} variant="label" color="secondary">
              {!!duration && secondsToHms(duration)}
              {!!duration && !!resolution && " • "}
              {!!resolution && `${resolution}p`}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
);

export default EpsiodeItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  image: {
    borderRadius: 4,
    aspectRatio: 16 / 9,
    width: 124,
    alignItems: "center",
    justifyContent: "center",
  },
});
