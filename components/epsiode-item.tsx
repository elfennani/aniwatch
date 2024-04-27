import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import React, { ForwardedRef } from "react";
import { Episode } from "@/interfaces/Episode";
import secondsToHms from "@/utils/seconds-to-hms";
import zinc from "@/utils/zinc";
import Text from "./text";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Image } from "expo-image";

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
    return (
      <TouchableOpacity
        ref={ref}
        activeOpacity={0.8}
        {...props}
        style={[styles.container, watched && { opacity: 0.75 }]}
      >
        {thumbnail ? (
          <Image
            source={{
              uri: thumbnail,
              width: 124,
              height: 124 * (9 / 16),
            }}
            contentFit="cover"
            style={styles.image}
          />
        ) : (
          <View style={styles.image}>
            <AntDesign name="meho" color={zinc[600]} size={24} />
          </View>
        )}
        <View>
          <Text>Episode {number}</Text>
          <Text style={[styles.info, { textTransform: "uppercase" }]}>
            sub {dub && "• dub"}{" "}
          </Text>
          <Text style={styles.info}>
            {!!duration && secondsToHms(duration)}
            {!!duration && !!resolution && " • "}
            {!!resolution && `${resolution}p`}
          </Text>
        </View>
      </TouchableOpacity>
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
    backgroundColor: zinc[800],
    alignItems: "center",
    justifyContent: "center",
  },
  title: {},
  info: {
    fontSize: 12,
    color: zinc[400],
    marginTop: 4,
  },
});
