import { StyleSheet, ToastAndroid, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import Tag from "@/interfaces/Tag";
import Section from "./section";
import Text from "./text";
import { useTheme } from "@/ctx/theme-provider";

type Props = {
  tags: Tag[];
};

const TagsGrid = ({ tags }: Props) => {
  const [spoilers, setSpoilers] = useState(false);
  const {
    colors: { primary },
  } = useTheme();

  function toggleSpoilers() {
    setSpoilers((spoiler) => !spoiler);
  }

  function notify(description: string): void {
    ToastAndroid.show(description, ToastAndroid.SHORT);
  }

  return (
    <Section
      title="Tags"
      style={{ flexWrap: "wrap", flexDirection: "row", marginHorizontal: -8 }}
      tailing={
        tags.some((tag) => tag.spoiler) && (
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={toggleSpoilers}
            hitSlop={16}
          >
            <Text style={{ color: primary, fontSize: 12 }}>
              {spoilers ? "hide" : "show"} spoilers
            </Text>
          </TouchableOpacity>
        )
      }
    >
      {tags
        .filter((tag) => !tag.spoiler || spoilers)
        .map((tag, i) => (
          <TouchableOpacity
            disabled={!tag.description}
            onLongPress={() => notify(tag.description!)}
            key={tag.id}
            style={[styles.tag, tag.spoiler && styles.spoiler]}
            activeOpacity={0.8}
          >
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ flex: 1, fontSize: 12 }}
            >
              {tag.name}
            </Text>
            <Text style={{ fontSize: 12, color: primary }}>{tag.rank}%</Text>
          </TouchableOpacity>
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
