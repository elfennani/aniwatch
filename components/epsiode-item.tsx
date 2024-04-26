import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { Episode } from "@/interfaces/Episode";
import secondsToHms from "@/utils/seconds-to-hms";
import zinc from "@/utils/zinc";
import Text from "./text";
import AntDesign from "@expo/vector-icons/AntDesign";

type Props = {
  episode: Episode;
};

const EpsiodeItem = ({
  episode: { dub, id, number, thumbnail, duration, resolution },
}: Props) => {
  return (
    <Link
      style={styles.container}
      href={`/watch/${id}/${number}` as any}
      asChild
    >
      <TouchableOpacity activeOpacity={0.8}>
        {thumbnail ? (
          <Image source={{ uri: thumbnail }} style={styles.image} />
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
    </Link>
  );
};

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
    resizeMode: "cover",
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
