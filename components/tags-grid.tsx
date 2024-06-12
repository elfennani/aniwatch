import {
  Platform,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import React, { memo, useState } from "react";
import Tag from "@/interfaces/Tag";
import Section from "./section";
import Text from "./text";
import { useTheme } from "@/ctx/theme-provider";

type Props = {
  tags: Tag[];
  spoilers?: boolean;
};

const TagsGrid = memo(({ tags }: Props) => {
  const [spoilers, setSpoilers] = useState(false);

  function toggleSpoilers() {
    setSpoilers((spoiler) => !spoiler);
  }

  function notify(description: string): void {
    ToastAndroid.show(description, ToastAndroid.SHORT);
  }

  return (
    <View className="px-6 gap-4">
      <View className="flex-row items-center justify-between">
        <Text className="!font-medium text-2xl">Tags</Text>
        <TouchableOpacity onPress={toggleSpoilers} hitSlop={16}>
          <Text className="text-sm text-zinc-400 dark:text-zinc-600">
            {spoilers ? "hide" : "show"} spoilers
          </Text>
        </TouchableOpacity>
      </View>
      <TagsContent tags={tags} spoilers={spoilers} />
    </View>
  );
});

const TagsContent = (props: Props) => {
  if (Platform.OS == "web")
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2">
        <Tags {...props} />
      </div>
    );

  return <Tags {...props} />;
};

const Tags = ({ tags, spoilers }: Props) => {
  return tags
    .filter((tag) => !tag.spoiler || spoilers)
    .map((tag) => (
      <View key={tag.id} className="flex-row items-baseline gap-2">
        <Text className="font-medium">{tag.name}</Text>
        {tag.spoiler && (
          <Text className="font-medium text-xs text-purple-500 dark:text-purple-400">
            (Spoiler)
          </Text>
        )}
        <View className="flex-1 border-b border-dashed border-zinc-300" />
        <Text className="font-medium text-purple-500 dark:text-purple-400">
          {tag.rank}%
        </Text>
      </View>
    ));
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
