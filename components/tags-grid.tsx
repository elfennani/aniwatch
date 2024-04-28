import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import Tag from "@/interfaces/Tag";
import Section from "./section";
import purple from "@/utils/purple";
import Text from "./text";

type Props = {
  tags: Tag[];
};

const TagsGrid = ({ tags }: Props) => {
  const [spoilers, setSpoilers] = useState(false);

  function toggleSpoilers() {
    setSpoilers((spoiler) => !spoiler);
  }

  return (
    <Section
      title="Tags"
      style={{ flexWrap: "wrap", flexDirection: "row", marginHorizontal: -8 }}
      tailing={
        <TouchableOpacity activeOpacity={0.75} onPress={toggleSpoilers}>
          <Text style={{ color: purple[500], fontSize: 12 }}>
            {spoilers ? "hide" : "show"} spoilers
          </Text>
        </TouchableOpacity>
      }
    >
      {tags
        .filter((tag) => !tag.spoiler || spoilers)
        .map((tag, i) => (
          <View
            key={tag.id}
            style={[styles.tag, tag.spoiler && styles.spoiler]}
          >
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ flex: 1, fontSize: 12 }}
            >
              {tag.name}
            </Text>
            <Text style={{ fontSize: 12, color: purple[500] }}>
              {tag.rank}%
            </Text>
          </View>
        ))}
    </Section>
  );
};

export default TagsGrid;

const styles = StyleSheet.create({
  tag: {
    width: "50%",
    flexDirection: "row",
    gap: 4,
    padding: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  spoiler: {
    backgroundColor: "#a955f71f",
  },
});